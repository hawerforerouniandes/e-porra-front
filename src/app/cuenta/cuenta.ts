export class Cuenta {
  id: number;
  tipo: boolean;
  descripcion: string;
  valor: number;
  numero_tarjeta: string;
  fecha_registro: Date;

  constructor(
    id: number,
    tipo: boolean,
    descripcion: string,
    valor: number,
    numero_tarjeta: string,
    fecha_registro: Date
  ) {
      this.id = id,
      this.tipo = tipo,
      this.descripcion = descripcion,
      this.valor = valor,
      this.numero_tarjeta = numero_tarjeta,
      this.fecha_registro = fecha_registro
  }
}
