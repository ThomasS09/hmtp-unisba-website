<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class RateLimitRequests
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = $this->resolveRequestSignature($request);

        // Check if rate limited
        if (RateLimiter::tooManyAttempts($key, $maxAttempts = 60)) {
            $seconds = RateLimiter::availableIn($key);

            Log::warning('Rate limit exceeded', [
                'ip' => $request->ip(),
                'path' => $request->path(),
                'method' => $request->method(),
                'retry_after' => $seconds,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Terlalu banyak permintaan. Silakan coba lagi dalam ' . $seconds . ' detik.',
                'error' => 'Rate limit exceeded',
                'retry_after' => $seconds,
            ], 429);
        }

        RateLimiter::increment($key, $maxAttempts, 60); // 60 seconds window

        return $next($request);
    }

    /**
     * Resolve the request signature.
     */
    protected function resolveRequestSignature(Request $request): string
    {
        return $request->ip() . '|' . $request->path();
    }
}
