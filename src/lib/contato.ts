/**
 * Dados de contato da Íntegra.
 *
 * TROCAR ANTES DE PUBLICAR: o número abaixo é um espaço reservado. Formato do
 * WhatsApp: código do país + DDD + número, só dígitos.
 */
export const WHATSAPP = "5516000000000";
export const EMAIL = "contato@integramarketing.com.br";
export const INSTAGRAM = "https://www.instagram.com/integra.marketing";

export function linkWhatsApp(mensagem: string) {
  return `https://api.whatsapp.com/send?phone=${WHATSAPP}&text=${encodeURIComponent(
    mensagem,
  )}`;
}
