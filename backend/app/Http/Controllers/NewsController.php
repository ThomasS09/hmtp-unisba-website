<?php

namespace App\Http\Controllers;

use App\Models\News;
use Illuminate\Http\Request;

class NewsController extends Controller
{
    /**
     * Display a listing of news/articles.
     */
    public function index(Request $request)
    {
        $query = News::query();

        if ($request->has('category') && $request->category !== 'Semua') {
            $query->where('category', $request->category);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        $news = $query->orderBy('created_at', 'desc')->get();

        return response()->json($news, 200);
    }

    /**
     * Display the specified news article.
     */
    public function show($id)
    {
        $article = News::find($id);

        if (!$article) {
            return response()->json(['message' => 'Artikel tidak ditemukan'], 404);
        }

        return response()->json($article, 200);
    }

    /**
     * Store a new article in storage (Admin).
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'author' => 'nullable|string|max:100',
            'excerpt' => 'required|string',
            'content' => 'required|string',
            'read_time' => 'nullable|string|max:50',
            'gradient' => 'nullable|string|max:100',
        ]);

        $news = News::create([
            'title' => $validated['title'],
            'category' => $validated['category'],
            'author' => $validated['author'] ?? 'Humas HMTP',
            'excerpt' => $validated['excerpt'],
            'content' => $validated['content'],
            'date' => now()->translatedFormat('d F Y'),
            'read_time' => $validated['read_time'] ?? '3 menit',
            'gradient' => $validated['gradient'] ?? 'from-amber-600/30 to-yellow-500/25',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil diterbitkan.',
            'data' => $news
        ], 201);
    }

    /**
     * Update the specified article (Admin).
     */
    public function update(Request $request, $id)
    {
        $article = News::find($id);

        if (!$article) {
            return response()->json(['message' => 'Artikel tidak ditemukan'], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:100',
            'author' => 'nullable|string|max:100',
            'excerpt' => 'sometimes|required|string',
            'content' => 'sometimes|required|string',
            'read_time' => 'nullable|string|max:50',
            'gradient' => 'nullable|string|max:100',
        ]);

        $article->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil diperbarui.',
            'data' => $article
        ], 200);
    }

    /**
     * Remove the specified article (Admin).
     */
    public function destroy($id)
    {
        $article = News::find($id);

        if (!$article) {
            return response()->json(['message' => 'Artikel tidak ditemukan'], 404);
        }

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berita berhasil dihapus.'
        ], 200);
    }
}
