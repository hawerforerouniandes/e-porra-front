export class Apuesta {
    id: number;
    valor_apostado: number;
    id_apostador: number;
    id_competidor: number;
    id_carrera: number;
    ganancia: number;

    constructor(
        id: number,
        valor_apostado: number,
        id_apostador: number,
        id_competidor: number,
        id_carrera: number,
        ganancia: number
    ) {
        this.id = id,
            this.valor_apostado = valor_apostado,
            this.id_apostador = id_apostador,
            this.id_competidor = id_competidor,
            this.id_carrera = id_carrera
            this.ganancia = ganancia
    }
}
