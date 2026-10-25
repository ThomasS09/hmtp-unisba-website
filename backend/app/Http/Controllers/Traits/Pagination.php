<?php

namespace App\Http\Controllers\Traits;

use Illuminate\Http\Request;

trait Pagination
{
    /**
     * Apply pagination to a query builder or collection.
     *
     * @param  \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Eloquent\Collection  $query
     * @param  int  $perPage
     * @param  array  $columns
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    protected function paginate($query, int $perPage = 10, array $columns = ['*'])
    {
        if ($query instanceof \Illuminate\Database\Eloquent\Builder) {
            return $query->paginate($perPage, $columns);
        }

        if ($query instanceof \Illuminate\Database\Eloquent\Collection) {
            return \Illuminate\Pagination\LengthAwarePaginator::make(
                $query->forPage(request('page', 1), $perPage),
                $query->count(),
                $perPage
            );
        }

        return $query;
    }

    /**
     * Get pagination parameters from request.
     *
     * @return array
     */
    protected function getPaginationParams()
    {
        $sortBy = (string) request('sort_by', 'created_at');

        return [
            'page' => request('page', 1),
            'per_page' => min(100, max(1, (int) request('per_page', 10))), // dibatasi: permintaan per_page raksasa tidak boleh membebani server
            // ponytail: allow-list kolom & arah, biar orderBy tidak pernah menerima input mentah
            'sort_by' => preg_match('/^[a-z_]+$/', $sortBy) ? $sortBy : 'created_at',
            'sort_order' => request('sort_order') === 'asc' ? 'asc' : 'desc',
        ];
    }
}
