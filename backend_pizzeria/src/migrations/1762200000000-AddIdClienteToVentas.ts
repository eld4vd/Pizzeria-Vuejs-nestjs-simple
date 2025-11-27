import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdClienteToVentas1762200000000 implements MigrationInterface {
    name = 'AddIdClienteToVentas1762200000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Verificar si la columna ya existe
        const hasColumn = await queryRunner.hasColumn('ventas', 'id_cliente');
        
        if (!hasColumn) {
            await queryRunner.query(`
                ALTER TABLE "ventas" 
                ADD COLUMN "id_cliente" integer NULL
            `);
            
            // Agregar índice para mejorar búsquedas por cliente
            await queryRunner.query(`
                CREATE INDEX "IDX_ventas_id_cliente" ON "ventas" ("id_cliente")
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const hasColumn = await queryRunner.hasColumn('ventas', 'id_cliente');
        
        if (hasColumn) {
            await queryRunner.query(`DROP INDEX IF EXISTS "IDX_ventas_id_cliente"`);
            await queryRunner.query(`ALTER TABLE "ventas" DROP COLUMN "id_cliente"`);
        }
    }
}
