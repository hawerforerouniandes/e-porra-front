export class Cuenta {
  id: number;
  tipo: string;
  valor: number;
  numero_tarjeta: number;
  fecha_registro: string;

  constructor(
    id: number,
    tipo: string,
    valor: number,
    numero_tarjeta: number,
    fecha_registro: string
  ) {
      this.id = id,
      this.tipo = tipo,
      this.valor = valor,
      this.numero_tarjeta = numero_tarjeta,
      this.fecha_registro = fecha_registro
  }
}
