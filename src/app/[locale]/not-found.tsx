import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-6xl font-bold text-navy-900">404</h1>
      <p className="mt-4 text-xl text-gray-600">
        Page not found
      </p>
      <p className="mt-2 text-gray-500 text-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/en"
          className="bg-navy-900 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-navy-700 transition-colors text-sm"
        >
          English Home
        </Link>
        <Link
          href="/es"
          className="border border-navy-900 text-navy-900 font-semibold px-6 py-2.5 rounded-md hover:bg-navy-50 transition-colors text-sm"
        >
          Inicio en Español
        </Link>
      </div>
    </div>
  );
}
