/**
 * E-phy API client
 * API documentation: https://ephy.anses.fr/api/v1/
 * Open data: https://www.data.gouv.fr/datasets/donnees-ouvertes-du-catalogue-e-phy-des-produits-phytopharmaceutiques-matieres-fertilisantes-et-supports-de-culture-adjuvants-produits-mixtes-et-melanges
 */

const EPHY_BASE_URL = "https://ephy.anses.fr/api/v1";

export interface EphyProduct {
  id: number;
  numeroProduit: string;
  nomProduit: string;
  etatProduit: string;
  dateFin?: string;
  typeAmmeProduit: string;
  titulaire: string;
  formulationType?: string;
  biocontrole?: boolean;
  usages?: EphyUsage[];
}

export interface EphyUsage {
  id: number;
  culture: string;
  cible: string;
  numeroAmm: string;
  doseMini?: string;
  doseMaxi?: string;
  unitesDose?: string;
  nombreMaxTraitementsParAn?: number;
  zoneNonTraiteeRuissellement?: string;
  zoneNonTraiteeDerive?: string;
  etatUsage: string;
  mentionsRisques?: string;
  conditionsEmploi?: string;
}

export interface EphySubstance {
  id: number;
  nomSubstance: string;
  numeroSubstance?: string;
  statut?: string;
  dateExpiration?: string;
}

export interface EphyProductList {
  count: number;
  next: string | null;
  previous: string | null;
  results: EphyProduct[];
}

export interface EphyUsageList {
  count: number;
  next: string | null;
  previous: string | null;
  results: EphyUsage[];
}

export interface EphySubstanceList {
  count: number;
  next: string | null;
  previous: string | null;
  results: EphySubstance[];
}

async function ephyFetch<T>(path: string): Promise<T> {
  const url = `${EPHY_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `E-phy API error: ${response.status} ${response.statusText} for ${url}`
    );
  }

  return response.json() as Promise<T>;
}

/**
 * Search products in the e-phy catalog.
 * @param search - Free text search (product name, AMM number, etc.)
 * @param page - Page number (default 1)
 */
export async function searchProducts(
  search: string,
  page = 1
): Promise<EphyProductList> {
  const params = new URLSearchParams({ search, page: String(page) });
  return ephyFetch<EphyProductList>(`/produit/?${params}`);
}

/**
 * Get a single product by its AMM number or internal id.
 * @param numeroProduit - The AMM number (e.g. "2160001")
 */
export async function getProductByAmm(
  numeroProduit: string
): Promise<EphyProductList> {
  const params = new URLSearchParams({ numeroProduit });
  return ephyFetch<EphyProductList>(`/produit/?${params}`);
}

/**
 * Get detailed information about a product by its internal id.
 */
export async function getProductDetails(id: number): Promise<EphyProduct> {
  return ephyFetch<EphyProduct>(`/produit/${id}/`);
}

/**
 * Get the list of usages (culture + target) for a product.
 * @param produitId - Internal id of the product
 * @param page - Page number (default 1)
 */
export async function getProductUsages(
  produitId: number,
  page = 1
): Promise<EphyUsageList> {
  const params = new URLSearchParams({
    produit: String(produitId),
    page: String(page),
  });
  return ephyFetch<EphyUsageList>(`/usageproduit/?${params}`);
}

/**
 * Search active substances.
 * @param search - Substance name
 * @param page - Page number (default 1)
 */
export async function searchSubstances(
  search: string,
  page = 1
): Promise<EphySubstanceList> {
  const params = new URLSearchParams({ search, page: String(page) });
  return ephyFetch<EphySubstanceList>(`/substanceactive/?${params}`);
}
