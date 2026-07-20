export default function AdminPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Selamat Datang, Admin!</h2>
      <p className="text-gray-600">
        Halaman ini hanya bisa diakses oleh akun dengan role "admin".
      </p>
    </div>
  );
}
