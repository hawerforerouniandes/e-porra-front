export class Cuenta {
  id: number;
  tipo: boolean;
  valor: number;
  numero_tarjeta: string;
  fecha_registro: Date;

  constructor(
    id: number,
    tipo: boolean,
    valor: number,
    numero_tarjeta: string,
    fecha_registro: Date
  ) {
      this.id = id,
      this.tipo = tipo,
      this.valor = valor,
      this.numero_tarjeta = numero_tarjeta,
      this.fecha_registro = fecha_registro
  }
}
