export default function Home() {
  const tools = [
    {
      name: "search_products",
      description:
        "Rechercher des produits phytosanitaires par nom, substance active, numéro AMM ou titulaire",
    },
    {
      name: "get_product_by_amm",
      description: "Obtenir un produit par son numéro AMM",
    },
    {
      name: "get_product_details",
      description: "Obtenir les détails complets d'un produit par son ID e-phy",
    },
    {
      name: "get_product_usages",
      description:
        "Lister les usages autorisés (cultures/cibles) avec les doses et conditions d'emploi",
    },
    {
      name: "search_active_substances",
      description:
        "Rechercher des matières actives avec leur statut d'approbation",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 p-8">
      <main className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Serveur MCP e-phy
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Ce serveur MCP (Model Context Protocol) fournit à votre assistant IA
          des informations sur les produits phytosanitaires du catalogue{" "}
          <a
            href="https://ephy.anses.fr"
            className="underline text-blue-600 dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            e-phy (ANSES)
          </a>
          .
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Point d&apos;accès MCP
          </h2>
          <code className="block bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4 text-sm font-mono text-zinc-800 dark:text-zinc-200">
            {typeof window !== "undefined"
              ? `${window.location.origin}/mcp`
              : "http://localhost:3000/mcp"}
          </code>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
            Outils disponibles
          </h2>
          <ul className="space-y-3">
            {tools.map((tool) => (
              <li
                key={tool.name}
                className="bg-white dark:bg-zinc-800 rounded-lg p-4 border border-zinc-200 dark:border-zinc-700"
              >
                <code className="text-sm font-mono font-semibold text-blue-700 dark:text-blue-400">
                  {tool.name}
                </code>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  {tool.description}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
