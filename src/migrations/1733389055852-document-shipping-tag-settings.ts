import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class DocumentShippingTagSettings1733389055852 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'document_shipping_tag_settings',
                columns: [
                    { name: 'id', type: 'character varying', isPrimary: true },
                    { name: 'store_id', type: 'character varying', isNullable: true },
                    { name: 'forced_number', type: 'int', isNullable: true },
                    { name: 'number_format', type: 'character varying', isNullable: true },
                    { name: 'template', type: 'character varying', isNullable: true },
                    { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()' },
                    { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()' },
                    { name: 'deleted_at', type: 'TIMESTAMP WITH TIME ZONE', isNullable: true }
                ],
                foreignKeys: [
                    {
                        columnNames: ['store_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'public.store',
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('document_shipping_tag_settings', true);
    }

}
