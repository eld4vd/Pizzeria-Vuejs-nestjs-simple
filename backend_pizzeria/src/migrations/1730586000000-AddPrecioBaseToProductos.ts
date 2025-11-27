import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPrecioBaseToProductos1730586000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Agregar columna precio_base con valor por defecto 0
    await queryRunner.addColumn(
      'productos',
      new TableColumn({
        name: 'precio_base',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
        isNullable: false,
      }),
    );

    // Copiar el precio actual a precio_base para productos existentes
    await queryRunner.query(`
      UPDATE productos SET precio_base = precio WHERE precio_base = 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar columna precio_base
    await queryRunner.dropColumn('productos', 'precio_base');
  }
}
