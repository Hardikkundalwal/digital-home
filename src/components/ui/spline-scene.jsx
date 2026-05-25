import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className }) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading 3D...</span>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
