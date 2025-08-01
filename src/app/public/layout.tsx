export default async function PublicLayout({ children }: { children: React.ReactNode }) {


  // Passe les children au composant client
  return (
    <div className={`flex flex-1`}>
      <main className="flex flex-1 pb-10">
        {children}
      </main>
    </div>
  )
}