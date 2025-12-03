import React from "react";

const products = [
  {
    title: "Organic Fertilizer",
    price: "₹599",
    image:
      "https://i.pinimg.com/1200x/c5/53/b5/c553b51b9e38aa0f4e418e33655e156b.jpg",
  },
  {
    title: "Garden Tool Kit",
    price: "₹1299",
    image:
      "https://i.pinimg.com/1200x/c8/c5/af/c8c5aff5a2d8dba7f0fe1e87f2e02e19.jpg",
  },
  {
    title: "Premium Seeds Pack",
    price: "₹299",
    image:
      "https://i.pinimg.com/1200x/e1/b0/83/e1b08306773780435a7f09bc6dd1efb9.jpg",
  },
];

export default function ProductsSection() {
  return (
    <section className="py-20 px-6 sm:px-10 max-w-[1400px] mx-auto">
      <h2 className="text-4xl font-extrabold mb-10 text-gray-900 text-center">
        Top Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
        {products.map((p, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden hover:-translate-y-2 transition-all"
          >
            <img src={p.image} className="w-full h-64 object-cover" />
            <div className="p-5">
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="text-green-600 font-bold mt-1">{p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
