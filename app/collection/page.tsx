// app/collection/page.tsx
'use client';
import Image from "next/image";

export default function CollectionPage() {
  const products = [
    {
      id: 1,
      name: 'Tractor X200',
      price: '₹2,50,000',
      image: '/products/tractor.jpg',
      slug: 'tractor-x200',
    },
    {
      id: 2,
      name: 'Harvester Pro',
      price: '₹5,90,000',
      image: '/products/harvester.jpg',
      slug: 'harvester-pro',
    },
    // Add more products here...
  ];

  return (
    <main className="min-h-screen px-6 py-10 bg-[#f9fff2]">
      <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">Our Agricultural Machinery</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <a
            key={product.id}
            href={`/product/${product.slug}`}
            className="block bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <Image src={product.image} alt={product.name} className="w-full h-60 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-green-900">{product.name}</h2>
              <p className="text-green-700 mt-2">{product.price}</p>
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
