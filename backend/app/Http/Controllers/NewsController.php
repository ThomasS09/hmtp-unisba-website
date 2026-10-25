<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;
use App\Http\Controllers\Traits\Pagination;
use App\Http\Controllers\Traits\ApiResponse;

class NewsController extends Controller
{
    use Pagination, ApiResponse;
    /**
     * Display a listing of news/articles.
     */
    public function index(Request $request)
    {
        // Validate query parameters
        $validated = $request->validate([
            'category' => 'nullable|string|max:100',
            'search' => 'nullable|string|max:255',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $params = $this->getPaginationParams();

        $query = News::query();

        if (isset($validated['category']) && $validated['category'] !== 'Semua') {
            $query->where('category', strip_tags($validated['category']));
        }

        if (isset($validated['search']) && !empty($validated['search'])) {
            $search = strip_tags($validated['search']);
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $news = $this->paginate($query, $params['per_page']);

        return $this->successResponse([
            'data' => $news->items(),
            'meta' => [
                'current_page' => $news->currentPage(),
                'per_page' => $news->perPage(),
                'total' => $news->total(),
                'last_page' => $news->lastPage(),
                'from' => $news->firstItem(),
                'to' => $news->lastItem(),
            ]
        ], 'News retrieved successfully.');
    }

    /**
     * Display the specified news article.
     */
    public function show($id)
    {
        $article = News::find($id);

        if (!$article) {
            return $this->notFoundResponse('Artikel tidak ditemukan');
        }

        return $this->successResponse($article, 'Article retrieved successfully.');
    }

    /**
     * Store a new article in storage (Admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255|min:3',
            'category' => 'required|string|max:100|in:Akademik,Organisasi,Kegiatan,Pengumuman,Prestasi,Lainnya',
            'author' => 'nullable|string|max:100|regex:/^[\pL\s\-\.]+$/u',
            'excerpt' => 'required|string|min:10|max:500',
            'content' => 'required|string|min:50|max:50000',
            // array syntax: pipe di dalam regex tidak boleh dipisah Laravel
            'read_time' => ['nullable', 'string', 'max:50', 'regex:/^[0-9]+\s*(menit|detik|jam)$/'],
            'gradient' => 'nullable|string|max:100|regex:/^from-[\w\-\/]+\s+to-[\w\-\/]+$/',
        ], [
            'title.required' => 'Judul wajib diisi.',
            'title.min' => 'Judul minimal 3 karakter.',
            'category.required' => 'Kategori wajib dipilih.',
            'category.in' => 'Kategori tidak valid.',
            'author.regex' => 'Nama penulis hanya boleh berisi huruf, spasi, tanda hubung, dan titik.',
            'excerpt.required' => 'Ringkasan wajib diisi.',
            'excerpt.min' => 'Ringkasan minimal 10 karakter.',
            'excerpt.max' => 'Ringkasan maksimal 500 karakter.',
            'content.required' => 'Konten wajib diisi.',
            'content.min' => 'Konten minimal 50 karakter.',
            'read_time.regex' => 'Format waktu baca tidak valid (contoh: 3 menit).',
        ]);

        // Sanitize HTML content but allow safe tags for formatting
        $news = News::create([
            'title' => strip_tags($validated['title']),
            'category' => strip_tags($validated['category']),
            'author' => isset($validated['author']) ? strip_tags($validated['author']) : 'Humas HMTP',
            'excerpt' => strip_tags($validated['excerpt']),
            'content' => strip_tags($validated['content'], '<p><br><strong><em><ul><ol><li><a><h1><h2><h3><blockquote>'),
            'date' => now()->translatedFormat('d F Y'),
            'read_time' => isset($validated['read_time']) ? strip_tags($validated['read_time']) : '3 menit',
            'gradient' => isset($validated['gradient']) ? strip_tags($validated['gradient']) : 'from-amber-600/30 to-yellow-500/25',
        ]);

        return $this->successResponse($news, 'Berita berhasil diterbitkan.', 201);
    }

    /**
     * Update the specified article (Admin).
     */
    public function update(Request $request, $id)
    {
        $article = News::find($id);

        if (!$article) {
            return $this->notFoundResponse('Artikel tidak ditemukan');
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255|min:3',
            'category' => 'sometimes|required|string|max:100|in:Akademik,Organisasi,Kegiatan,Pengumuman,Prestasi,Lainnya',
            'author' => 'nullable|string|max:100|regex:/^[\pL\s\-\.]+$/u',
            'excerpt' => 'sometimes|required|string|min:10|max:500',
            'content' => 'sometimes|required|string|min:50|max:50000',
            // array syntax: pipe di dalam regex tidak boleh dipisah Laravel
            'read_time' => ['nullable', 'string', 'max:50', 'regex:/^[0-9]+\s*(menit|detik|jam)$/'],
            'gradient' => 'nullable|string|max:100|regex:/^from-[\w\-\/]+\s+to-[\w\-\/]+$/',
        ]);

        // Sanitize fields if present
        $updateData = [];
        foreach ($validated as $key => $value) {
            if ($key === 'content') {
                // Allow safe HTML tags in content
                $updateData[$key] = strip_tags($value, '<p><br><strong><em><ul><ol><li><a><h1><h2><h3><blockquote>');
            } else {
                $updateData[$key] = strip_tags($value);
            }
        }

        $article->update($updateData);

        return $this->successResponse($article, 'Berita berhasil diperbarui.');
    }

    /**
     * Remove the specified article (Admin).
     */
    public function destroy($id)
    {
        $article = News::find($id);

        if (!$article) {
            return $this->notFoundResponse('Artikel tidak ditemukan');
        }

        $article->delete();

        return $this->successResponse(null, 'Berita berhasil dihapus.');
    }
}
