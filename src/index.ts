import type { Converter } from "../../fc/src/core/converter-interface";
import { promises as fs } from "fs";
import { extname } from "path";

export default {
  name: "png-to-jpg",
  description: "Convert png to jpg",
  sourceFormats: ["png"],
  targetFormats: ["jpg", "jpeg"],

  convert: async (
    input: string,
    output: string,
    options?: Record<string, any>
  ): Promise<boolean> => {
    try {
      // Verificar se o arquivo de entrada existe
      try {
        await fs.access(input);
      } catch {
        console.error(`Arquivo de entrada não encontrado: ${input}`);
        return false;
      }

      // Verificar se a extensão do arquivo de entrada é PNG
      if (extname(input).toLowerCase() !== ".png") {
        console.error("O arquivo de entrada não é um PNG");
        return false;
      }

      // Verificar se a extensão do arquivo de saída é JPG ou JPEG
      const outputExt = extname(output).toLowerCase();
      if (outputExt !== ".jpg" && outputExt !== ".jpeg") {
        console.error("O arquivo de saída deve ser JPG ou JPEG");
        return false;
      }

      // Usar o módulo Sharp para a conversão
      const sharp = await import("sharp");

      let image = sharp.default(input);

      // Aplicar opções
      const quality = options?.quality || 80;

      if (options?.resize) {
        const [width, height] = options.resize.split("x").map(Number);
        if (width && height) {
          image = image.resize(width, height);
        }
      }

      // Converter e salvar
      await image.jpeg({ quality }).toFile(output);

      return true;
    } catch (error) {
      console.error("Erro ao converter imagem:", error);
      return false;
    }
  },
} as Converter;
