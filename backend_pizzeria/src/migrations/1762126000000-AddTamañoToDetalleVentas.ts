import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTamañoToDetalleVentas1762126000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'detalle_ventas',
      new TableColumn({
        name: 'tamaño',
        type: 'varchar',
        length: '50',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('detalle_ventas', 'tamaño');
  }
}
