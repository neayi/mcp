# E-phy MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server built with [Next.js](https://nextjs.org) that provides AI assistants with information about phytosanitary products from the French [e-phy catalog](https://ephy.anses.fr/) (pesticides, fertilizers, adjuvants, mixtures and blends).

Data source: [Open data e-phy (ANSES / data.gouv.fr)](https://www.data.gouv.fr/datasets/donnees-ouvertes-du-catalogue-e-phy-des-produits-phytopharmaceutiques-matieres-fertilisantes-et-supports-de-culture-adjuvants-produits-mixtes-et-melanges)

## Available Tools

| Tool | Description |
|------|-------------|
| `search_products` | Search phytosanitary products by name, active substance, AMM number, or holder |
| `get_product_by_amm` | Retrieve a product by its AMM (Autorisation de Mise sur le Marché) number |
| `get_product_details` | Get full details of a product by its internal e-phy ID |
| `get_product_usages` | List authorized usages (crops/targets) with dosage and safety requirements |
| `search_active_substances` | Search active substances by name with their approval status |

## Getting Started

### Development

```bash
npm install
npm run dev
```

The MCP server will be available at `http://localhost:3000/mcp`.

### Using with an MCP client (Claude Desktop, etc.)

Add the following to your MCP client configuration:

```json
{
  "mcpServers": {
    "ephy": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

### Production

```bash
npm run build
npm start
```

## Architecture

- **`lib/ephy.ts`** – Type-safe client for the [e-phy REST API](https://ephy.anses.fr/api/v1/)
- **`app/[transport]/route.ts`** – Next.js App Router route handler that exposes the MCP server over [Streamable HTTP](https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http) (supports both GET/POST)

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) – Official TypeScript MCP SDK
- [Zod](https://zod.dev) – Schema validation for tool parameters
