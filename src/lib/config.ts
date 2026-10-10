export const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Falhar cedo (e de forma clara) é melhor do que pedidos para um URL "undefined"
if (!API_URL) {
	throw new Error("Variável de ambiente em falta: NEXT_PUBLIC_API_URL");
}