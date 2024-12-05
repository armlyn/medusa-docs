import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class ShippingTag1733389359971 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'shipping_tag',
                columns: [
                    { name: 'id', type: 'character varying', isPrimary: true },
                    { name: 'number', type: 'character varying' },
                    { name: 'display_number', type: 'character varying' },
                    { name: 'order_id', type: 'character varying' },
                    { name: 'document_settings_id', type: 'character varying' },
                    { name: 'document_shipping_tag_settings_id', type: 'character varying' },
                    { name: 'created_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()' },
                    { name: 'updated_at', type: 'TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()' },
                    { name: 'deleted_at', type: 'TIMESTAMP WITH TIME ZONE', isNullable: true }
                ],
                foreignKeys: [
                    {
                        columnNames: ['order_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'public.order',
                    },
                    {
                        columnNames: ['document_settings_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'public.document_settings',
                    },
                    {
                        columnNames: ['document_shipping_tag_settings_id'],
                        referencedColumnNames: ['id'],
                        referencedTableName: 'public.document_shipping_tag_settings',
                    }
                ]
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('shipping_tag', true);
        await queryRunner.query(`UPDATE "order" SET metadata = metadata #- '{shipping_tag_id}'`);
    }

}
