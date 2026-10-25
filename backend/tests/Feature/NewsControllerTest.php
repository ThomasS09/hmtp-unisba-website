<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\News;
use Illuminate\Foundation\Testing\RefreshDatabase;

class NewsControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function guest_can_view_all_news()
    {
        News::factory()->count(5)->create();

        $response = $this->getJson('/api/news');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data.data')
            ->assertJsonPath('data.meta.total', 5);
    }

    /** @test */
    public function guest_can_view_specific_news()
    {
        $news = News::factory()->create([
            'title' => 'Test News Article',
        ]);

        $response = $this->getJson("/api/news/{$news->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.title', 'Test News Article');
    }

    /** @test */
    public function guest_can_filter_news_by_category()
    {
        News::factory()->create(['category' => 'Akademik']);
        News::factory()->create(['category' => 'Organisasi']);

        $response = $this->getJson('/api/news?category=Akademik');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.data');
    }

    /** @test */
    public function guest_can_search_news()
    {
        News::factory()->create(['title' => 'Laravel Development']);
        News::factory()->create(['title' => 'React Tutorial']);

        $response = $this->getJson('/api/news?search=Laravel');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data.data');
    }

    /** @test */
    public function admin_can_create_news()
    {
        $user = User::factory()->create();

        $newsData = [
            'title' => 'New Article',
            'category' => 'Akademik',
            'author' => 'Admin HMTP',
            'excerpt' => 'This is a test excerpt for the article.',
            'content' => 'This is the full content of the article with more than 50 characters.',
            'read_time' => '5 menit',
        ];

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/news', $newsData);

        $response->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('news', [
            'title' => 'New Article',
            'category' => 'Akademik',
        ]);
    }

    /** @test */
    public function news_creation_fails_with_invalid_category()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/news', [
                'title' => 'Test',
                'category' => 'InvalidCategory',
                'excerpt' => 'Test excerpt',
                'content' => 'Test content with more than fifty characters here.',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category']);
    }

    /** @test */
    public function news_creation_fails_with_short_content()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/news', [
                'title' => 'Test',
                'category' => 'Akademik',
                'excerpt' => 'Test excerpt',
                'content' => 'Short',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['content']);
    }

    /** @test */
    public function admin_can_update_news()
    {
        $user = User::factory()->create();
        $news = News::factory()->create(['title' => 'Old Title']);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/news/{$news->id}", [
                'title' => 'Updated Title',
            ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('news', [
            'id' => $news->id,
            'title' => 'Updated Title',
        ]);
    }

    /** @test */
    public function admin_can_delete_news()
    {
        $user = User::factory()->create();
        $news = News::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/news/{$news->id}");

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseMissing('news', [
            'id' => $news->id,
        ]);
    }

    /** @test */
    public function guest_cannot_create_news()
    {
        $response = $this->postJson('/api/news', [
            'title' => 'Test',
            'category' => 'Akademik',
            'excerpt' => 'Test excerpt',
            'content' => 'Test content',
        ]);

        $response->assertStatus(401);
    }
}
