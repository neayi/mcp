import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import {
  searchProducts,
  getProductByAmm,
  getProductDetails,
  getProductUsages,
  searchSubstances,
} from "@/lib/ephy";

// Create a single McpServer instance shared across requests (stateless)
function createEphyMcpServer(): McpServer {
  const server = new McpServer({
    name: "ephy-mcp",
    version: "1.0.0",
  });

  // Tool: search_products
  server.tool(
    "search_products",
    "Search phytosanitary products in the French e-phy catalog (pesticides, fertilizers, etc.). Returns product names, AMM numbers, status, and holder information.",
    {
      search: z
        .string()
        .describe(
          "Text to search for: product name, active substance, AMM number, or holder name"
        ),
      page: z
        .number()
        .int()
        .positive()
        .default(1)
        .describe("Page number for pagination (default: 1)"),
    },
    async ({ search, page }) => {
      const result = await searchProducts(search, page);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                total: result.count,
                page,
                hasMore: result.next !== null,
                products: result.results.map((p) => ({
                  id: p.id,
                  numeroProduit: p.numeroProduit,
                  nomProduit: p.nomProduit,
                  etatProduit: p.etatProduit,
                  dateFin: p.dateFin,
                  typeAmmeProduit: p.typeAmmeProduit,
                  titulaire: p.titulaire,
                  biocontrole: p.biocontrole,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool: get_product_by_amm
  server.tool(
    "get_product_by_amm",
    "Get a phytosanitary product from the e-phy catalog by its AMM (Autorisation de Mise sur le Marché) number.",
    {
      numeroProduit: z
        .string()
        .describe("The AMM number of the product (e.g. '2160001')"),
    },
    async ({ numeroProduit }) => {
      const result = await getProductByAmm(numeroProduit);
      if (result.results.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No product found with AMM number ${numeroProduit}`,
            },
          ],
        };
      }
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result.results[0], null, 2),
          },
        ],
      };
    }
  );

  // Tool: get_product_details
  server.tool(
    "get_product_details",
    "Get detailed information about a phytosanitary product by its internal e-phy ID. Use search_products or get_product_by_amm first to find the ID.",
    {
      id: z
        .number()
        .int()
        .positive()
        .describe("The internal e-phy product ID"),
    },
    async ({ id }) => {
      const product = await getProductDetails(id);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(product, null, 2),
          },
        ],
      };
    }
  );

  // Tool: get_product_usages
  server.tool(
    "get_product_usages",
    "Get the authorized usages (crops and pests/diseases) for a phytosanitary product, including dosage, application conditions, and safety requirements.",
    {
      productId: z
        .number()
        .int()
        .positive()
        .describe(
          "The internal e-phy product ID (obtained from search_products or get_product_by_amm)"
        ),
      page: z
        .number()
        .int()
        .positive()
        .default(1)
        .describe("Page number for pagination (default: 1)"),
    },
    async ({ productId, page }) => {
      const result = await getProductUsages(productId, page);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                total: result.count,
                page,
                hasMore: result.next !== null,
                usages: result.results.map((u) => ({
                  id: u.id,
                  culture: u.culture,
                  cible: u.cible,
                  etatUsage: u.etatUsage,
                  doseMini: u.doseMini,
                  doseMaxi: u.doseMaxi,
                  unitesDose: u.unitesDose,
                  nombreMaxTraitementsParAn: u.nombreMaxTraitementsParAn,
                  zoneNonTraiteeRuissellement: u.zoneNonTraiteeRuissellement,
                  zoneNonTraiteeDerive: u.zoneNonTraiteeDerive,
                  mentionsRisques: u.mentionsRisques,
                  conditionsEmploi: u.conditionsEmploi,
                })),
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  // Tool: search_active_substances
  server.tool(
    "search_active_substances",
    "Search active substances (matières actives) in the e-phy catalog, including their approval status and expiration date.",
    {
      search: z
        .string()
        .describe("Name of the active substance to search for"),
      page: z
        .number()
        .int()
        .positive()
        .default(1)
        .describe("Page number for pagination (default: 1)"),
    },
    async ({ search, page }) => {
      const result = await searchSubstances(search, page);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                total: result.count,
                page,
                hasMore: result.next !== null,
                substances: result.results,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  );

  return server;
}

function handleMcpRequest(request: Request): Promise<Response> {
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  const server = createEphyMcpServer();
  return server.connect(transport).then(() => transport.handleRequest(request));
}

export const GET = handleMcpRequest;
export const POST = handleMcpRequest;
export const DELETE = handleMcpRequest;
