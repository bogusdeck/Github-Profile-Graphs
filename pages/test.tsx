export default function Test() {
  return (
    <div className="min-h-screen bg-black text-green-400 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">TEST PAGE</h1>
        <p>If you can see this, Next.js is working!</p>
        <p className="mt-4">Time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
