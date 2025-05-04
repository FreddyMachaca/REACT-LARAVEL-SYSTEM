CREATE OR REPLACE FUNCTION fn_l_reporte_asistencia(
p_per_id INT,
p_fecha_ini DATE,
p_fecha_fin DATE
)
RETURNS TABLE (
    att_fecha date,
    att_dia varchar(50),
    att_per_id int,
    min_atraso int,
    horario_ing_manana time,
    horario_sal_manana time,
    horario_ing_tarde time,
    horario_sal_tarde time,
    marca_entrada_manana time,
    marca_salida_manana time,
    marca_entrada_tarde time,
    marca_salida_tarde time,
    no_marcado_entrada int,
    no_marcado_salida int,
    he_descripcion varchar(100),
    licencia text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        tca.att_fecha,
        tca.att_dia,
        tca.att_per_id,
        CASE 
		    WHEN tca.att_min_atraso_mayor30 > 0 THEN tca.att_min_atraso_mayor30
		    ELSE tca.att_min_atraso
		  END AS min_atraso,
        -- Horarios asignados
        CASE
            WHEN tca.att_dia = 'Lunes' THEN tcah.ah_lun_ing1
            WHEN tca.att_dia = 'Martes' THEN tcah.ah_mar_ing1
            WHEN tca.att_dia = 'Miércoles' THEN tcah.ah_mie_ing1
            WHEN tca.att_dia = 'Jueves' THEN tcah.ah_jue_ing1
            WHEN tca.att_dia = 'Viernes' THEN tcah.ah_vie_ing1
            WHEN tca.att_dia = 'Sábado' THEN tcah.ah_sab_ing1
            WHEN tca.att_dia = 'Domingo' THEN tcah.ah_dom_ing1
        END AS horario_ing_manana,
        CASE
            WHEN tca.att_dia = 'Lunes' THEN tcah.ah_lun_sal1
            WHEN tca.att_dia = 'Martes' THEN tcah.ah_mar_sal1
            WHEN tca.att_dia = 'Miércoles' THEN tcah.ah_mie_sal1
            WHEN tca.att_dia = 'Jueves' THEN tcah.ah_jue_sal1
            WHEN tca.att_dia = 'Viernes' THEN tcah.ah_vie_sal1
            WHEN tca.att_dia = 'Sábado' THEN tcah.ah_sab_sal1
            WHEN tca.att_dia = 'Domingo' THEN tcah.ah_dom_sal1
        END AS horario_sal_manana,
        CASE
            WHEN tca.att_dia = 'Lunes' THEN tcah.ah_lun_ing2
            WHEN tca.att_dia = 'Martes' THEN tcah.ah_mar_ing2
            WHEN tca.att_dia = 'Miércoles' THEN tcah.ah_mie_ing2
            WHEN tca.att_dia = 'Jueves' THEN tcah.ah_jue_ing2
            WHEN tca.att_dia = 'Viernes' THEN tcah.ah_vie_ing2
            WHEN tca.att_dia = 'Sábado' THEN tcah.ah_sab_ing2
            WHEN tca.att_dia = 'Domingo' THEN tcah.ah_dom_ing2
        END AS horario_ing_tarde,
        CASE
            WHEN tca.att_dia = 'Lunes' THEN tcah.ah_lun_sal2
            WHEN tca.att_dia = 'Martes' THEN tcah.ah_mar_sal2
            WHEN tca.att_dia = 'Miércoles' THEN tcah.ah_mie_sal2
            WHEN tca.att_dia = 'Jueves' THEN tcah.ah_jue_sal2
            WHEN tca.att_dia = 'Viernes' THEN tcah.ah_vie_sal2
            WHEN tca.att_dia = 'Sábado' THEN tcah.ah_sab_sal2
            WHEN tca.att_dia = 'Domingo' THEN tcah.ah_dom_sal2
        END AS horario_sal_tarde,
        
        tca.att_ing1 AS marca_entrada_manana,
        tca.att_sal1 AS marca_salida_manana,
        tca.att_ing2 AS marca_entrada_tarde,
        tca.att_sal2 AS marca_salida_tarde,
        
        CASE
            WHEN (
                CASE
                    WHEN tca.att_dia = 'Lunes' THEN tcah.ah_lun_ing1
                    WHEN tca.att_dia = 'Martes' THEN tcah.ah_mar_ing1
                    WHEN tca.att_dia = 'Miércoles' THEN tcah.ah_mie_ing1
                    WHEN tca.att_dia = 'Jueves' THEN tcah.ah_jue_ing1
                    WHEN tca.att_dia = 'Viernes' THEN tcah.ah_vie_ing1
                    WHEN tca.att_dia = 'Sábado' THEN tcah.ah_sab_ing1
                    WHEN tca.att_dia = 'Domingo' THEN tcah.ah_dom_ing1
                END
            ) IS NOT NULL AND tca.att_ing1 IS NULL THEN 1 ELSE 0 END
            +
            CASE
            WHEN (
                CASE
                    WHEN tca.att_dia = 'Lunes' THEN tcah.ah_lun_ing2
                    WHEN tca.att_dia = 'Martes' THEN tcah.ah_mar_ing2
                    WHEN tca.att_dia = 'Miércoles' THEN tcah.ah_mie_ing2
                    WHEN tca.att_dia = 'Jueves' THEN tcah.ah_jue_ing2
                    WHEN tca.att_dia = 'Viernes' THEN tcah.ah_vie_ing2
                    WHEN tca.att_dia = 'Sábado' THEN tcah.ah_sab_ing2
                    WHEN tca.att_dia = 'Domingo' THEN tcah.ah_dom_ing2
                END
            ) IS NOT NULL AND tca.att_ing2 IS NULL THEN 1 ELSE 0 END
        AS no_marcado_entrada,
        
        -- Conteo de marcaciones faltantes de salida
        CASE
            WHEN (
                CASE
                    WHEN tca.att_dia = 'Lunes' THEN tcah.ah_lun_sal1
                    WHEN tca.att_dia = 'Martes' THEN tcah.ah_mar_sal1
                    WHEN tca.att_dia = 'Miércoles' THEN tcah.ah_mie_sal1
                    WHEN tca.att_dia = 'Jueves' THEN tcah.ah_jue_sal1
                    WHEN tca.att_dia = 'Viernes' THEN tcah.ah_vie_sal1
                    WHEN tca.att_dia = 'Sábado' THEN tcah.ah_sab_sal1
                    WHEN tca.att_dia = 'Domingo' THEN tcah.ah_dom_sal1
                END
            ) IS NOT NULL AND tca.att_sal1 IS NULL THEN 1 ELSE 0 END
            +
            CASE
            WHEN (
                CASE
                    WHEN tca.att_dia = 'Lunes' THEN tcah.ah_lun_sal2
                    WHEN tca.att_dia = 'Martes' THEN tcah.ah_mar_sal2
                    WHEN tca.att_dia = 'Miércoles' THEN tcah.ah_mie_sal2
                    WHEN tca.att_dia = 'Jueves' THEN tcah.ah_jue_sal2
                    WHEN tca.att_dia = 'Viernes' THEN tcah.ah_vie_sal2
                    WHEN tca.att_dia = 'Sábado' THEN tcah.ah_sab_sal2
                    WHEN tca.att_dia = 'Domingo' THEN tcah.ah_dom_sal2
                END
            ) IS NOT NULL AND tca.att_sal2 IS NULL THEN 1 ELSE 0 END
        AS no_marcado_salida,
        tche.he_descripcion,
        
        CASE 
		    WHEN tca.att_fecha BETWEEN tclj.lj_fecha_inicial AND tclj.lj_fecha_final 
		    THEN CONCAT(tclj.lj_hora_salida, ' - ', tclj.lj_hora_retorno)
		    ELSE ''
		END AS licencia
    FROM tbl_cp_asistencia tca
    INNER JOIN tbl_persona tp ON tp.per_id = tca.att_per_id
    INNER JOIN tbl_cp_asignacion_horario tcah ON tcah.ah_per_id = tp.per_id
    LEFT JOIN tbl_cp_horario_especial tche 
  		ON tche.he_per_id = tp.per_id 
  		AND tche.he_fecha = tca.att_fecha
  	left join tbl_cp_licencia_justificada tclj 
  		on tclj.lj_per_id = tp.per_id
    WHERE tca.att_fecha BETWEEN tcah.ah_fecha_inicial AND tcah.ah_fecha_final
    AND tp.per_id = p_per_id 
    AND tca.att_fecha BETWEEN p_fecha_ini AND p_fecha_fin
    AND (tcah.ah_fecha_inicial, tcah.ah_fecha_final) = (
        SELECT MAX(tcah2.ah_fecha_inicial), MAX(tcah2.ah_fecha_final)
        FROM tbl_cp_asignacion_horario tcah2
        WHERE tcah2.ah_per_id = tp.per_id
        AND tca.att_fecha BETWEEN tcah2.ah_fecha_inicial AND tcah2.ah_fecha_final
    )
    ORDER BY tca.att_fecha ASC;
END;
$$;