ALTER TABLE public.tbl_kd_educacion_formal ALTER COLUMN ef_centro_form TYPE int4 USING ef_centro_form::int4;


-- AÑADIR SECUENCIA EN tbl_pla_cas para cs_id
CREATE SEQUENCE tbl_pla_cas_cs_id_seq;

ALTER TABLE tbl_pla_cas 
    ALTER COLUMN cs_id SET DEFAULT nextval('tbl_pla_cas_cs_id_seq');