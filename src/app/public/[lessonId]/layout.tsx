export default async function PublicLayout({ children }: { children: React.ReactNode }) {

  return (

    <div className={`flex flex-1`}>
      <main className="flex flex-1 pb-10">
        {children}
      </main>
    </div>
  )
}