// components/Footer.tsx

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 text-center text-sm">
        © {new Date().getFullYear()} Regreen Agro. All rights reserved.
      </div>
    </footer>
  );
}
