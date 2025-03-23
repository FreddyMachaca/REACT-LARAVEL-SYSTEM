ALTER TABLE tbl_seg_menu
ALTER COLUMN me_icono TYPE VARCHAR(255);

ALTER TABLE tbl_seg_menu
ALTER COLUMN me_url TYPE VARCHAR(255);

ALTER TABLE public.tbl_kd_educacion_formal ALTER COLUMN ef_centro_form TYPE int4 USING ef_centro_form::int4;
