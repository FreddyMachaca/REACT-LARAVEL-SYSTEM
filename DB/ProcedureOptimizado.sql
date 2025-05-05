CREATE OR REPLACE PROCEDURE sp_generar_asistencia(
    p_fecha1 date,
    p_fecha2 date,
    p_usuario varchar(100)
)
LANGUAGE plpgsql
AS $$
DECLARE
    ------------------- GENERAR ASISTENCIA -------------------
    v_fecha_ini date;
    v_fecha_fin date;
    v_cod_fun integer;
    v_dia_semana integer;
    v_origen_entero integer;
    v_dia_semana_literal varchar(10);
    v_fecha date;
    v_c1 integer;
    v_c2 integer;
    v_c3 integer;
    v_c4 integer;
    v_c5 integer;
    v_c6 integer;
    v_c7 integer;
    v_c8 integer;
    v_TipoMarca varchar(50);
    v_Hora time;
    v_Marcas4 integer;
    v_TotalMarcas integer;
    v_X1 time;
    v_X2 time;
    v_X3 time;
    v_X4 time;
    v_X5 time;
    v_X6 time;
    v_X7 time;
    v_X8 time;
    v_Ing1 time;
    v_Sal1 time;
    v_Ing2 time;
    v_Sal2 time;
    v_sw integer;
    v_grupo integer;
    v_d integer;
    v_ta_marca time;
    v_ta_marca2 time;
    v_auxiliar time;
    v_i integer;
    v_ta_flag integer;
    v_cont integer;
    v_horam integer;
    v_aux_grupo integer;
    v_origen varchar(20);
    v_lj_tipo_licencia integer;
    v_lj_hora_salida time;
    v_lj_hora_retorno time;
    v_n integer;
    v_hor_sw integer;
    v_id_horario integer;
    v_fecha_baja date;
    v_as_fecha_asignacion date;
    v_as_fecha_baja date;
    v_fecha_final date;
    v_Ing1_ant time;
    v_Sal1_ant time;
    v_Ing2_ant time;
    v_Sal2_ant time;
    v_tipo char(1);
    v_g integer;
    v_a integer;
    v_b integer;
    v_ta_indice integer;
    v_ta_hora1 time;
    v_ta_hora2 time;
    v_ta_hora1_aux time;
    v_ah_Id integer;
    v_nm integer;
    v_no_marcados integer;
    v_sw_nm integer;
    v_sw_feriado integer;
    v_tolerancia integer;
    v_MinutosEM integer;
    v_MinutosET integer;
    v_tipo_nm char(1);
    v_c integer;
    v_Ing1_aux time;
    v_Sal1_aux time;
    v_lj_id integer;
    v_Lun_Ing1 time;
    v_Lun_Ing2 time;
    v_Lun_Sal1 time;
    v_Lun_Sal2 time;
    v_Mar_Ing1 time;
    v_Mar_Ing2 time;
    v_Mar_Sal1 time;
    v_Mar_Sal2 time;
    v_Mie_Ing1 time;
    v_Mie_Ing2 time;
    v_Mie_Sal1 time;
    v_Mie_Sal2 time;
    v_Jue_Ing1 time;
    v_Jue_Ing2 time;
    v_Jue_Sal1 time;
    v_Jue_Sal2 time;
    v_Vie_Ing1 time;
    v_Vie_Ing2 time;
    v_Vie_Sal1 time;
    v_Vie_Sal2 time;
    v_Sab_Ing1 time;
    v_Sab_Ing2 time;
    v_Sab_Sal1 time;
    v_Sab_Sal2 time;
    v_Dom_Ing1 time;
    v_Dom_Ing2 time;
    v_Dom_Sal1 time;
    v_Dom_Sal2 time;
    v_ah_Id_tipo_horario integer;
    v_ah_fecha_inicial date;
    v_ah_fecha_final date;
    v_sw_horario integer;
    v_dia_anterior date;
    v_per_id integer;
    v_ma_id integer;
    v_ma_di_id integer;
    v_en_vacacion boolean;
    v_fe_descripcion varchar(200);
    v_he_id integer;
    v_he_ing1 time;
    v_he_sal1 time;
    v_he_ing2 time;
    v_he_sal2 time;

    v_batch_size integer := 500; -- procesamiento en bloque
    v_batch_counter integer := 0;
    v_total_procesados integer := 0;
    v_start_time timestamp;
    v_sa_id integer;
    v_tolerancia_global integer;
    v_marcaciones_horas time[] := '{}';
    v_marcaciones_ids integer[] := '{}';

    cur_codigos CURSOR FOR
        SELECT DISTINCT ma.ma_per_id
        FROM tbl_cp_marcaciones ma
        WHERE ma.ma_fecha BETWEEN p_fecha1 AND p_fecha2
          AND (ma.ma_estado IS NULL)
        ORDER BY ma.ma_per_id;

    cur_marcas CURSOR (p_per_id integer, p_fecha date) FOR
        SELECT ma.ma_id, ma.ma_hora, ma.ma_di_id
        FROM tbl_cp_marcaciones ma
        WHERE ma.ma_per_id = p_per_id
          AND ma.ma_fecha = p_fecha
          AND (ma.ma_estado IS NULL)
        ORDER BY ma.ma_hora;

    cur_licencias CURSOR (p_per_id integer, p_fecha date) FOR
        SELECT lj.lj_id, lj.lj_tipo_licencia, lj.lj_hora_salida, lj.lj_hora_retorno
        FROM tbl_cp_licencia_justificada lj
        WHERE lj.lj_per_id = p_per_id
          AND p_fecha BETWEEN lj.lj_fecha_inicial AND lj.lj_fecha_final
          AND lj.lj_estado = 'V';

    cur_vacaciones CURSOR (p_per_id integer, p_fecha date) FOR
        SELECT TRUE
        FROM tbl_kd_asignacion_vacacion va
        WHERE va.va_per_id = p_per_id
          AND va.va_estado = 'V'
          AND p_fecha BETWEEN va.va_fecha_ingreso_r::date AND
              (va.va_fecha_ingreso_r::date + (va.va_dias_ley - va.va_dias_restantes) * INTERVAL '1 day');

    cur_codigos_optimizado CURSOR FOR
        SELECT DISTINCT ma_per_id
        FROM tmp_personal_a_procesar;
BEGIN
    v_start_time := clock_timestamp();
    RAISE NOTICE 'Iniciando procesamiento de asistencia: %', v_start_time;

    -- Tablas Temporales

    -- Tabla temporal para personal
    CREATE TEMP TABLE tmp_personal_a_procesar AS
    SELECT DISTINCT ma.ma_per_id
    FROM tbl_cp_marcaciones ma
    WHERE ma.ma_fecha BETWEEN p_fecha1 AND p_fecha2
      AND (ma.ma_estado IS NULL);

    CREATE INDEX idx_tmp_personal ON tmp_personal_a_procesar(ma_per_id);
    RAISE NOTICE 'Personal a procesar cargado: % empleados', (SELECT COUNT(*) FROM tmp_personal_a_procesar);

    -- Tabla temporal para tolerancias
    CREATE TEMP TABLE tmp_tolerancia AS
    SELECT to_tiempo
    FROM tbl_cp_tolerancia
    WHERE to_estado = 'V'
    LIMIT 1;

    IF NOT EXISTS (SELECT 1 FROM tmp_tolerancia) THEN
        INSERT INTO tmp_tolerancia VALUES (15);
    END IF;

    SELECT to_tiempo INTO v_tolerancia_global FROM tmp_tolerancia LIMIT 1;
    RAISE NOTICE 'Valor de tolerancia: %', v_tolerancia_global;

    -- Tabla temporal para feriados
    CREATE TEMP TABLE tmp_feriados AS
    SELECT fe_fecha::date AS fecha, fe_descripcion
    FROM tbl_kd_feriados
    WHERE fe_fecha BETWEEN p_fecha1 AND p_fecha2
      AND fe_estado = 'V';

    CREATE INDEX idx_tmp_feriados_fecha ON tmp_feriados(fecha);
    RAISE NOTICE 'Feriados cargados: % registros', (SELECT COUNT(*) FROM tmp_feriados);

    -- Tabla temporal para horarios especiales
    CREATE TEMP TABLE tmp_horarios_especiales AS
    SELECT he_per_id, he_fecha, he_id, he_ing1, he_sal1, he_ing2, he_sal2
    FROM tbl_cp_horario_especial
    WHERE he_fecha BETWEEN p_fecha1 AND p_fecha2
      AND he_estado = 'V';

    CREATE INDEX idx_tmp_he_per_fecha ON tmp_horarios_especiales(he_per_id, he_fecha);
    RAISE NOTICE 'Horarios especiales cargados: % registros', (SELECT COUNT(*) FROM tmp_horarios_especiales);

    -- Tabla temporal para vacaciones
    CREATE TEMP TABLE tmp_vacaciones AS
    WITH fechas_rango AS (
        SELECT generate_series(p_fecha1, p_fecha2, interval '1 day')::date AS fecha
    )
    SELECT DISTINCT va.va_per_id, fr.fecha
    FROM tbl_kd_asignacion_vacacion va
    CROSS JOIN fechas_rango fr
    WHERE va.va_estado = 'V'
      AND fr.fecha BETWEEN va.va_fecha_ingreso_r::date
          AND (va.va_fecha_ingreso_r::date + (va.va_dias_ley - va.va_dias_restantes) * INTERVAL '1 day');

    CREATE INDEX idx_tmp_vacaciones ON tmp_vacaciones(va_per_id, fecha);
    RAISE NOTICE 'Datos de vacaciones cargados: % registros', (SELECT COUNT(*) FROM tmp_vacaciones);

    -- Tabla temporal para licencias
    CREATE TEMP TABLE tmp_licencias AS
    WITH fechas_rango AS (
        SELECT generate_series(p_fecha1, p_fecha2, interval '1 day')::date AS fecha
    )
    SELECT lj.lj_per_id, fr.fecha, lj.lj_id, lj.lj_tipo_licencia,
           lj.lj_hora_salida, lj.lj_hora_retorno
    FROM tbl_cp_licencia_justificada lj
    CROSS JOIN fechas_rango fr
    WHERE lj.lj_estado = 'V'
      AND fr.fecha BETWEEN lj.lj_fecha_inicial AND lj.lj_fecha_final;

    CREATE INDEX idx_tmp_licencias ON tmp_licencias(lj_per_id, fecha);
    RAISE NOTICE 'Licencias cargadas: % registros', (SELECT COUNT(*) FROM tmp_licencias);

    -- Tabla temporal para asignación de horarios
    CREATE TEMP TABLE tmp_asignacion_horario AS
    SELECT *
    FROM tbl_cp_asignacion_horario
    WHERE ah_estado = 'V'
      AND ah_fecha_inicial <= p_fecha2
      AND ah_fecha_final >= p_fecha1;

    CREATE INDEX idx_tmp_ah_per_fecha ON tmp_asignacion_horario(ah_per_id, ah_fecha_inicial, ah_fecha_final);
    RAISE NOTICE 'Asignaciones de horario cargadas: % registros', (SELECT COUNT(*) FROM tmp_asignacion_horario);

    -- Tabla para acumular asistencias
    CREATE TEMP TABLE tmp_asistencia (
        att_id serial,
        att_per_id integer,
        att_fecha date,
        att_dia varchar(50),
        att_ing1 time,
        att_sal1 time,
        att_ing2 time,
        att_sal2 time,
        att_id_lic_ing1 integer,
        att_id_lic_sal1 integer,
        att_id_lic_ing2 integer,
        att_id_lic_sal2 integer,
        att_min_atraso integer,
        att_min_atraso_mayor30 integer,
        att_min_salio_antes integer,
        att_min_extras integer,
        att_tipo_observado varchar(10),
        att_id_horario integer,
        att_id_horario_esp integer,
        att_edificio integer
    );

    -- Tabla para acumular sanciones
    CREATE TEMP TABLE tmp_sanciones (
        sa_id integer,
        sa_per_id integer,
        sa_factor integer,
        sa_minutos integer,
        sa_fecha_inicio date,
        sa_fecha_fin date,
        sa_tipo_sancion varchar(3),
        sa_dias_sancion double precision,
        sa_estado varchar(3)
    );

    -- Obtener el último ID de sanciones para continuar la secuencia
    SELECT COALESCE(MAX(sa_id), 0) INTO v_sa_id FROM tbl_cp_sanciones;

    -- Tabla temporal con todas las marcaciones
    CREATE TEMP TABLE tmp_marcaciones AS
    SELECT ma_per_id, ma_fecha, ma_di_id,
           array_agg(ma_hora ORDER BY ma_hora) AS horas,
           array_agg(ma_id ORDER BY ma_hora) AS ids
    FROM tbl_cp_marcaciones
    WHERE ma_fecha BETWEEN p_fecha1 AND p_fecha2
      AND ma_estado IS NULL
    GROUP BY ma_per_id, ma_fecha, ma_di_id;

    CREATE INDEX idx_tmp_marcaciones ON tmp_marcaciones(ma_per_id, ma_fecha);
    RAISE NOTICE 'Marcaciones cargadas: % registros', (SELECT COUNT(*) FROM tmp_marcaciones);

    OPEN cur_codigos_optimizado;
    LOOP
        FETCH cur_codigos_optimizado INTO v_per_id;
        EXIT WHEN NOT FOUND;

        -- fechas de inicio y fin
        v_fecha_ini := p_fecha1;
        v_fecha_final := p_fecha2;

        -- Buscar fecha de asignación y baja
        SELECT MIN(ah_fecha_inicial), MAX(ah_fecha_final)
        INTO v_as_fecha_asignacion, v_as_fecha_baja
        FROM tmp_asignacion_horario
        WHERE ah_per_id = v_per_id;

        -- Ajustar fechas de inicio y fin según asignación
        IF v_as_fecha_asignacion IS NOT NULL AND v_as_fecha_asignacion > v_fecha_ini THEN
            v_fecha_ini := v_as_fecha_asignacion;
        END IF;

        IF v_as_fecha_baja IS NOT NULL AND v_as_fecha_baja < v_fecha_final THEN
            v_fecha_final := v_as_fecha_baja;
        END IF;

        v_fecha := v_fecha_ini;

        DELETE FROM tbl_cp_asistencia
        WHERE att_per_id = v_per_id
          AND att_fecha BETWEEN v_fecha_ini AND v_fecha_final;

        -- variables para horario
        v_hor_sw := 0;
        v_id_horario := 0;
        v_n := 0;
        v_sw_horario := 0;

        WHILE v_fecha <= v_fecha_final LOOP
            IF v_sw_horario = 0 THEN
                v_ah_Id_tipo_horario := 0;

                -- Buscar asignación de horario vigente para la fecha
                SELECT ah_id, ah_tipo_horario, ah_fecha_inicial, ah_fecha_final,
                       ah_lun_ing1, ah_lun_sal1, ah_lun_ing2, ah_lun_sal2,
                       ah_mar_ing1, ah_mar_sal1, ah_mar_ing2, ah_mar_sal2,
                       ah_mie_ing1, ah_mie_sal1, ah_mie_ing2, ah_mie_sal2,
                       ah_jue_ing1, ah_jue_sal1, ah_jue_ing2, ah_jue_sal2,
                       ah_vie_ing1, ah_vie_sal1, ah_vie_ing2, ah_vie_sal2,
                       ah_sab_ing1, ah_sab_sal1, ah_sab_ing2, ah_sab_sal2,
                       ah_dom_ing1, ah_dom_sal1, ah_dom_ing2, ah_dom_sal2
                INTO v_ah_Id, v_ah_Id_tipo_horario, v_ah_fecha_inicial, v_ah_fecha_final,
                     v_Lun_Ing1, v_Lun_Sal1, v_Lun_Ing2, v_Lun_Sal2,
                     v_Mar_Ing1, v_Mar_Sal1, v_Mar_Ing2, v_Mar_Sal2,
                     v_Mie_Ing1, v_Mie_Sal1, v_Mie_Ing2, v_Mie_Sal2,
                     v_Jue_Ing1, v_Jue_Sal1, v_Jue_Ing2, v_Jue_Sal2,
                     v_Vie_Ing1, v_Vie_Sal1, v_Vie_Ing2, v_Vie_Sal2,
                     v_Sab_Ing1, v_Sab_Sal1, v_Sab_Ing2, v_Sab_Sal2,
                     v_Dom_Ing1, v_Dom_Sal1, v_Dom_Ing2, v_Dom_Sal2
                FROM tmp_asignacion_horario
                WHERE ah_per_id = v_per_id
                  AND v_fecha BETWEEN ah_fecha_inicial AND ah_fecha_final
                LIMIT 1;

                IF v_ah_Id_tipo_horario IS NULL OR v_ah_Id_tipo_horario = 0 THEN
                    SELECT ah_fecha_inicial
                    INTO v_ah_fecha_inicial
                    FROM tmp_asignacion_horario
                    WHERE ah_per_id = v_per_id
                      AND ah_fecha_inicial BETWEEN v_fecha_ini AND v_fecha_final
                      AND ah_fecha_inicial >= v_fecha
                    ORDER BY ah_fecha_inicial
                    LIMIT 1;

                    IF v_ah_fecha_inicial IS NOT NULL THEN
                        v_ah_fecha_final := v_ah_fecha_inicial - INTERVAL '1 day';
                        v_ah_fecha_inicial := v_fecha;
                    ELSE
                        v_ah_fecha_inicial := v_fecha;
                        v_ah_fecha_final := v_fecha_final;
                    END IF;

                    -- Asignar horario por defecto (8:30-12:00, 14:30-19:00 de Lunes a Viernes)
                    v_Lun_Ing1 := '08:30:00';
                    v_Lun_Ing2 := '14:30:00';
                    v_Lun_Sal1 := '12:00:00';
                    v_Lun_Sal2 := '19:00:00';
                    v_Mar_Ing1 := '08:30:00';
                    v_Mar_Ing2 := '14:30:00';
                    v_Mar_Sal1 := '12:00:00';
                    v_Mar_Sal2 := '19:00:00';
                    v_Mie_Ing1 := '08:30:00';
                    v_Mie_Ing2 := '14:30:00';
                    v_Mie_Sal1 := '12:00:00';
                    v_Mie_Sal2 := '19:00:00';
                    v_Jue_Ing1 := '08:30:00';
                    v_Jue_Ing2 := '14:30:00';
                    v_Jue_Sal1 := '12:00:00';
                    v_Jue_Sal2 := '19:00:00';
                    v_Vie_Ing1 := '08:30:00';
                    v_Vie_Ing2 := '14:30:00';
                    v_Vie_Sal1 := '12:00:00';
                    v_Vie_Sal2 := '19:00:00';
                    v_Sab_Ing1 := '00:00:00';
                    v_Sab_Ing2 := '00:00:00';
                    v_Sab_Sal1 := '00:00:00';
                    v_Sab_Sal2 := '00:00:00';
                    v_Dom_Ing1 := '00:00:00';
                    v_Dom_Ing2 := '00:00:00';
                    v_Dom_Sal1 := '00:00:00';
                    v_Dom_Sal2 := '00:00:00';
                    v_ah_Id_tipo_horario := 1;
                    v_ah_Id := 0;
                END IF;

                v_sw_horario := 1;
                v_tipo := 'N'; -- Clasificacion interna
            END IF;

            -- Verificar si es feriado
            v_sw_feriado := 0;
            SELECT 1, fe_descripcion
            INTO v_sw_feriado, v_fe_descripcion
            FROM tmp_feriados
            WHERE fecha = v_fecha
            LIMIT 1;

            IF v_sw_feriado IS NULL THEN
                v_sw_feriado := 0;
                v_fe_descripcion := NULL;
            END IF;

            -- Obtener día de la semana (1=Lunes, 7=Domingo)
            v_dia_semana := EXTRACT(DOW FROM v_fecha);
            IF v_dia_semana = 0 THEN v_dia_semana := 7; END IF;
            v_dia_semana_literal := CASE v_dia_semana
                WHEN 1 THEN 'Lunes'
                WHEN 2 THEN 'Martes'
                WHEN 3 THEN 'Miércoles'
                WHEN 4 THEN 'Jueves'
                WHEN 5 THEN 'Viernes'
                WHEN 6 THEN 'Sábado'
                WHEN 7 THEN 'Domingo'
                ELSE 'Desconocido'
            END;

            -- Verificar si existe un horario especial
            SELECT he_id, he_ing1, he_sal1, he_ing2, he_sal2
            INTO v_he_id, v_he_ing1, v_he_sal1, v_he_ing2, v_he_sal2
            FROM tmp_horarios_especiales
            WHERE he_per_id = v_per_id
              AND he_fecha = v_fecha
            LIMIT 1;

            IF v_he_id IS NOT NULL THEN
                v_Ing1 := v_he_ing1;
                v_Sal1 := v_he_sal1;
                v_Ing2 := v_he_ing2;
                v_Sal2 := v_he_sal2;
            ELSE
                CASE v_dia_semana
                    WHEN 1 THEN -- Lunes
                        v_Ing1 := v_Lun_Ing1;
                        v_Sal1 := v_Lun_Sal1;
                        v_Ing2 := v_Lun_Ing2;
                        v_Sal2 := v_Lun_Sal2;
                    WHEN 2 THEN -- Martes
                        v_Ing1 := v_Mar_Ing1;
                        v_Sal1 := v_Mar_Sal1;
                        v_Ing2 := v_Mar_Ing2;
                        v_Sal2 := v_Mar_Sal2;
                    WHEN 3 THEN -- Miércoles
                        v_Ing1 := v_Mie_Ing1;
                        v_Sal1 := v_Mie_Sal1;
                        v_Ing2 := v_Mie_Ing2;
                        v_Sal2 := v_Mie_Sal2;
                    WHEN 4 THEN -- Jueves
                        v_Ing1 := v_Jue_Ing1;
                        v_Sal1 := v_Jue_Sal1;
                        v_Ing2 := v_Jue_Ing2;
                        v_Sal2 := v_Jue_Sal2;
                    WHEN 5 THEN -- Viernes
                        v_Ing1 := v_Vie_Ing1;
                        v_Sal1 := v_Vie_Sal1;
                        v_Ing2 := v_Vie_Ing2;
                        v_Sal2 := v_Vie_Sal2;
                    WHEN 6 THEN -- Sábado
                        v_Ing1 := v_Sab_Ing1;
                        v_Sal1 := v_Sab_Sal1;
                        v_Ing2 := v_Sab_Ing2;
                        v_Sal2 := v_Sab_Sal2;
                    WHEN 7 THEN -- Domingo
                        v_Ing1 := v_Dom_Ing1;
                        v_Sal1 := v_Dom_Sal1;
                        v_Ing2 := v_Dom_Ing2;
                        v_Sal2 := v_Dom_Sal2;
                    ELSE -- Día desconocido
                        v_Ing1 := NULL;
                        v_Sal1 := NULL;
                        v_Ing2 := NULL;
                        v_Sal2 := NULL;
                END CASE;
            END IF;

            v_X1 := NULL;
            v_X2 := NULL;
            v_X3 := NULL;
            v_X4 := NULL;
            v_X5 := NULL;
            v_X6 := NULL;
            v_X7 := NULL;
            v_X8 := NULL;
            v_Marcas4 := 0;
            v_TotalMarcas := 0;
            v_c1 := 0;
            v_c2 := 0;
            v_c3 := 0;
            v_c4 := 0;
            v_c5 := 0;
            v_c6 := 0;
            v_c7 := 0;
            v_c8 := 0;

            -- Si es día no laborable (horario con horas 00:00) o feriado
            IF (v_Ing1 = '00:00:00' AND v_Sal1 = '00:00:00' AND v_Ing2 = '00:00:00' AND v_Sal2 = '00:00:00') OR v_sw_feriado = 1 THEN
                INSERT INTO tmp_asistencia(
                    att_per_id, att_fecha, att_dia, att_ing1, att_sal1, att_ing2, att_sal2,
                    att_id_lic_ing1, att_id_lic_sal1, att_id_lic_ing2, att_id_lic_sal2,
                    att_min_atraso, att_min_atraso_mayor30, att_min_salio_antes, att_min_extras,
                    att_tipo_observado, att_id_horario, att_id_horario_esp, att_edificio
                )
                VALUES(
                    v_per_id, v_fecha, v_dia_semana_literal, NULL, NULL, NULL, NULL,
                    NULL, NULL, NULL, NULL,
                    0, 0, 0, 0,
                    CASE WHEN v_sw_feriado = 1 THEN 'FE' ELSE 'DL' END,
                    v_ah_Id_tipo_horario, v_ah_Id, NULL
                );
            ELSE
                -- Día laborable, verificar si está de vacaciones
                SELECT EXISTS(
                    SELECT 1 FROM tmp_vacaciones
                    WHERE va_per_id = v_per_id AND fecha = v_fecha
                ) INTO v_en_vacacion;

                -- Si está de vacaciones, registrar asistencia como vacación
                IF v_en_vacacion THEN
                    INSERT INTO tmp_asistencia(
                        att_per_id, att_fecha, att_dia, att_ing1, att_sal1, att_ing2, att_sal2,
                        att_id_lic_ing1, att_id_lic_sal1, att_id_lic_ing2, att_id_lic_sal2,
                        att_min_atraso, att_min_atraso_mayor30, att_min_salio_antes, att_min_extras,
                        att_tipo_observado, att_id_horario, att_id_horario_esp, att_edificio
                    )
                    VALUES(
                        v_per_id, v_fecha, v_dia_semana_literal, NULL, NULL, NULL, NULL,
                        NULL, NULL, NULL, NULL,
                        0, 0, 0, 0,
                        'VA', v_ah_Id_tipo_horario, v_ah_Id, NULL
                    );
                ELSE
                    -- Buscar marcaciones
                    SELECT horas, ids, ma_di_id
                    INTO v_marcaciones_horas, v_marcaciones_ids, v_ma_di_id
                    FROM tmp_marcaciones
                    WHERE ma_per_id = v_per_id AND ma_fecha = v_fecha
                    LIMIT 1;

                    -- Si hay marcaciones, procesarlas
                    IF v_marcaciones_horas IS NOT NULL THEN
                        v_TotalMarcas := array_length(v_marcaciones_horas, 1);

                        IF v_TotalMarcas >= 1 THEN v_X1 := v_marcaciones_horas[1]; v_c1 := 1; END IF;
                        IF v_TotalMarcas >= 2 THEN v_X2 := v_marcaciones_horas[2]; v_c2 := 1; END IF;
                        IF v_TotalMarcas >= 3 THEN v_X3 := v_marcaciones_horas[3]; v_c3 := 1; END IF;
                        IF v_TotalMarcas >= 4 THEN v_X4 := v_marcaciones_horas[4]; v_c4 := 1; END IF;
                        IF v_TotalMarcas >= 5 THEN v_X5 := v_marcaciones_horas[5]; v_c5 := 1; END IF;
                        IF v_TotalMarcas >= 6 THEN v_X6 := v_marcaciones_horas[6]; v_c6 := 1; END IF;
                        IF v_TotalMarcas >= 7 THEN v_X7 := v_marcaciones_horas[7]; v_c7 := 1; END IF;
                        IF v_TotalMarcas >= 8 THEN v_X8 := v_marcaciones_horas[8]; v_c8 := 1; END IF;

                        UPDATE tbl_cp_marcaciones
                        SET ma_estado = 'P'
                        WHERE ma_id = ANY(v_marcaciones_ids);
                    ELSE
                        v_TotalMarcas := 0;
                    END IF;

                    IF v_TotalMarcas > 0 THEN
                        IF v_TotalMarcas = 1 THEN
                            IF v_c1 = 1 THEN
                                IF (v_X1 < v_Ing1 + INTERVAL '2 hours') AND (v_X1 > v_Ing1 - INTERVAL '2 hours') THEN
                                    v_Ing1_aux := v_X1;
                                    v_Sal1_aux := NULL;
                                    v_Ing2 := NULL;
                                    v_Sal2 := NULL;
                                ELSIF (v_X1 < v_Ing2 + INTERVAL '2 hours') AND (v_X1 > v_Ing2 - INTERVAL '2 hours') THEN
                                    v_Ing1_aux := NULL;
                                    v_Sal1_aux := NULL;
                                    v_Ing2 := v_X1;
                                    v_Sal2 := NULL;
                                END IF;
                            END IF;
                        ELSIF v_TotalMarcas = 2 THEN
                            IF v_c1 = 1 AND v_c2 = 1 THEN
                                v_Ing1_aux := v_X1;
                                v_Sal1_aux := v_X2;
                                v_Ing2 := NULL;
                                v_Sal2 := NULL;
                            END IF;
                        ELSIF v_TotalMarcas = 3 THEN
                            IF v_c1 = 1 AND v_c2 = 1 AND v_c3 = 1 THEN
                                v_Ing1_aux := v_X1;
                                v_Sal1_aux := v_X2;
                                v_Ing2 := v_X3;
                                v_Sal2 := NULL;
                            END IF;
                        ELSIF v_TotalMarcas >= 4 THEN
                            v_Ing1_aux := v_X1;
                            v_Sal1_aux := v_X2;
                            v_Ing2 := v_X3;
                            v_Sal2 := v_X4;
                            v_Marcas4 := 1;
                        END IF;

                        -- Verificar licencias
                        SELECT lj_id, lj_tipo_licencia, lj_hora_salida, lj_hora_retorno
                        INTO v_lj_id, v_lj_tipo_licencia, v_lj_hora_salida, v_lj_hora_retorno
                        FROM tmp_licencias
                        WHERE lj_per_id = v_per_id AND fecha = v_fecha
                        LIMIT 1;

                        -- Aplicar licencias
                        v_id_horario := 0;
                        v_MinutosEM := 0;
                        v_MinutosET := 0;

                        IF v_lj_id IS NOT NULL THEN
                            IF v_lj_hora_salida IS NOT NULL AND v_lj_hora_retorno IS NOT NULL THEN
                                -- Si la licencia es para la mañana
                                IF v_lj_hora_salida < '12:00:00' AND v_lj_hora_retorno < '14:00:00' THEN
                                    v_Ing1_aux := v_lj_hora_retorno;
                                    v_id_horario := v_lj_id;
                                -- Si la licencia es para la tarde
                                ELSIF v_lj_hora_salida > '12:00:00' AND v_lj_hora_retorno > '14:00:00' THEN
                                    v_Ing2 := v_lj_hora_retorno;
                                    v_id_horario := v_lj_id;
                                -- Si la licencia es para todo el día
                                ELSIF v_lj_hora_salida < '10:00:00' AND v_lj_hora_retorno > '17:00:00' THEN
                                    v_Ing1_aux := NULL;
                                    v_Sal1_aux := NULL;
                                    v_Ing2 := NULL;
                                    v_Sal2 := NULL;
                                    v_id_horario := v_lj_id;
                                END IF;
                            END IF;
                        END IF;

                        -- Calcular minutos de atraso
                        IF v_Ing1_aux IS NOT NULL AND v_Ing1 IS NOT NULL THEN
                            IF v_Ing1_aux > v_Ing1 THEN
                                v_MinutosEM := EXTRACT(HOUR FROM (v_Ing1_aux - v_Ing1)) * 60 +
                                              EXTRACT(MINUTE FROM (v_Ing1_aux - v_Ing1));
                                IF v_MinutosEM <= v_tolerancia_global THEN
                                    v_MinutosEM := 0;
                                END IF;
                            END IF;
                        END IF;

                        IF v_Ing2 IS NOT NULL AND v_Lun_Ing2 IS NOT NULL THEN
                            IF v_Ing2 > v_Lun_Ing2 THEN
                                v_MinutosET := EXTRACT(HOUR FROM (v_Ing2 - v_Lun_Ing2)) * 60 +
                                              EXTRACT(MINUTE FROM (v_Ing2 - v_Lun_Ing2));
                                IF v_MinutosET <= v_tolerancia_global THEN
                                    v_MinutosET := 0;
                                END IF;
                            END IF;
                        END IF;

                        -- Calcular minutos totales de atraso
                        v_MinutosEM := v_MinutosEM + v_MinutosET;

                        INSERT INTO tmp_asistencia(
                            att_per_id, att_fecha, att_dia, att_ing1, att_sal1, att_ing2, att_sal2,
                            att_id_lic_ing1, att_id_lic_sal1, att_id_lic_ing2, att_id_lic_sal2,
                            att_min_atraso, att_min_atraso_mayor30, att_min_salio_antes, att_min_extras,
                            att_tipo_observado, att_id_horario, att_id_horario_esp, att_edificio
                        )
                        VALUES(
                            v_per_id, v_fecha, v_dia_semana_literal,
                            v_Ing1_aux, v_Sal1_aux, v_Ing2, v_Sal2,
                            v_id_horario, NULL, NULL, NULL,
                            v_MinutosEM, CASE WHEN v_MinutosEM > 30 THEN v_MinutosEM ELSE 0 END, 0, 0,
                            CASE
                                WHEN v_MinutosEM > 0 THEN 'AT' -- Atraso
                                ELSE 'OK' -- Normal
                            END,
                            v_ah_Id_tipo_horario, COALESCE(v_he_id, v_ah_Id), v_ma_di_id
                        );

                        -- Si hay minutos de atraso, verificar si corresponde sanción
                        IF v_MinutosEM > 0 THEN
                            DECLARE
                                v_dias_sancion double precision;
                                v_tipo_sancion varchar(3);
                            BEGIN
                                -- Calcular días de sanción
                                IF v_MinutosEM BETWEEN 45 AND 60 THEN
                                    v_dias_sancion := 0.5; -- Medio día de haber
                                    v_tipo_sancion := 'B';
                                ELSIF v_MinutosEM BETWEEN 61 AND 75 THEN
                                    v_dias_sancion := 1; -- 1 día de haber
                                    v_tipo_sancion := 'B';
                                ELSIF v_MinutosEM BETWEEN 76 AND 100 THEN
                                    v_dias_sancion := 2; -- 2 días de haber
                                    v_tipo_sancion := 'B';
                                ELSIF v_MinutosEM BETWEEN 101 AND 150 THEN
                                    v_dias_sancion := 3; -- 3 días de haber
                                    v_tipo_sancion := 'B';
                                ELSIF v_MinutosEM BETWEEN 151 AND 200 THEN
                                    v_dias_sancion := 4; -- 4 días de haber
                                    v_tipo_sancion := 'B';
                                ELSIF v_MinutosEM BETWEEN 201 AND 300 THEN
                                    v_dias_sancion := 5; -- 5 días de haber
                                    v_tipo_sancion := 'B';
                                ELSIF v_MinutosEM > 300 THEN
                                    v_dias_sancion := 6; -- 6 días de haber
                                    v_tipo_sancion := 'B';
                                ELSE
                                    v_dias_sancion := 0; -- No corresponde sanción
                                    v_tipo_sancion := 'N/A';
                                END IF;

                                IF v_dias_sancion > 0 THEN
                                    v_sa_id := v_sa_id + 1;

                                    INSERT INTO tmp_sanciones(
                                        sa_id, sa_per_id, sa_factor, sa_minutos,
                                        sa_fecha_inicio, sa_fecha_fin,
                                        sa_tipo_sancion, sa_dias_sancion, sa_estado
                                    )
                                    VALUES(
                                        v_sa_id, v_per_id, 57, v_MinutosEM,
                                        v_fecha, v_fecha,
                                        v_tipo_sancion, v_dias_sancion, 'V'
                                    );
                                END IF;
                            END;
                        END IF;
                    ELSE
                        -- Verificar licencias
                        SELECT lj_id, lj_tipo_licencia
                        INTO v_lj_id, v_lj_tipo_licencia
                        FROM tmp_licencias
                        WHERE lj_per_id = v_per_id AND fecha = v_fecha
                        LIMIT 1;

                        IF v_lj_id IS NOT NULL THEN
                            -- Tiene licencia, acumular como justificado
                            INSERT INTO tmp_asistencia(
                                att_per_id, att_fecha, att_dia, att_ing1, att_sal1, att_ing2, att_sal2,
                                att_id_lic_ing1, att_id_lic_sal1, att_id_lic_ing2, att_id_lic_sal2,
                                att_min_atraso, att_min_atraso_mayor30, att_min_salio_antes, att_min_extras,
                                att_tipo_observado, att_id_horario, att_id_horario_esp, att_edificio
                            )
                            VALUES(
                                v_per_id, v_fecha, v_dia_semana_literal, NULL, NULL, NULL, NULL,
                                v_lj_id, v_lj_id, v_lj_id, v_lj_id,
                                0, 0, 0, 0,
                                'JU', v_ah_Id_tipo_horario, v_ah_Id, NULL
                            );
                        ELSE
                            -- No tiene licencia, acumular como falta (ausente)
                            INSERT INTO tmp_asistencia(
                                att_per_id, att_fecha, att_dia, att_ing1, att_sal1, att_ing2, att_sal2,
                                att_id_lic_ing1, att_id_lic_sal1, att_id_lic_ing2, att_id_lic_sal2,
                                att_min_atraso, att_min_atraso_mayor30, att_min_salio_antes, att_min_extras,
                                att_tipo_observado, att_id_horario, att_id_horario_esp, att_edificio
                            )
                            VALUES(
                                v_per_id, v_fecha, v_dia_semana_literal, NULL, NULL, NULL, NULL,
                                NULL, NULL, NULL, NULL,
                                0, 0, 0, 0,
                                'AU', v_ah_Id_tipo_horario, v_ah_Id, NULL
                            );

                            -- Acumular sanción por ausencia
                            v_sa_id := v_sa_id + 1;

                            INSERT INTO tmp_sanciones(
                                sa_id, sa_per_id, sa_factor, sa_minutos,
                                sa_fecha_inicio, sa_fecha_fin,
                                sa_tipo_sancion, sa_dias_sancion, sa_estado
                            )
                            VALUES(
                                v_sa_id, v_per_id, 58, 0, -- Sin minutos, es falta completa
                                v_fecha, v_fecha,
                                'B', 1, 'V' -- 1 día de sanción por falta
                            );
                        END IF;
                    END IF;
                END IF;
            END IF;

            -- Guardar datos de horario anterior
            v_Ing1_ant := v_Ing1;
            v_Sal1_ant := v_Sal1;
            v_Ing2_ant := v_Ing2;
            v_Sal2_ant := v_Sal2;
            v_dia_anterior := v_fecha;

            -- Avanzar al siguiente día
            v_fecha := v_fecha + INTERVAL '1 day';

            IF v_fecha > v_ah_fecha_final THEN
                v_sw_horario := 0;
            END IF;

            -- Contador de registros procesados
            v_batch_counter := v_batch_counter + 1;
            v_total_procesados := v_total_procesados + 1;

            IF v_batch_counter >= v_batch_size THEN
                -- Insertar asistencias en bloque
                INSERT INTO tbl_cp_asistencia(
                    att_id, att_per_id, att_fecha, att_dia, att_ing1, att_sal1, att_ing2, att_sal2,
                    att_id_lic_ing1, att_id_lic_sal1, att_id_lic_ing2, att_id_lic_sal2,
                    att_min_atraso, att_min_atraso_mayor30, att_min_salio_antes, att_min_extras,
                    att_tipo_observado, att_id_horario, att_id_horario_esp, att_edificio
                )
                SELECT
                    nextval('seq_tbl_cp_asistencia'), att_per_id, att_fecha, att_dia,
                    att_ing1, att_sal1, att_ing2, att_sal2,
                    att_id_lic_ing1, att_id_lic_sal1, att_id_lic_ing2, att_id_lic_sal2,
                    att_min_atraso, att_min_atraso_mayor30, att_min_salio_antes, att_min_extras,
                    att_tipo_observado, att_id_horario, att_id_horario_esp, att_edificio
                FROM tmp_asistencia;

                -- Insertar sanciones en bloque
                INSERT INTO tbl_cp_sanciones
                SELECT * FROM tmp_sanciones;

                -- Limpiar tablas temporales
                TRUNCATE TABLE tmp_asistencia;
                TRUNCATE TABLE tmp_sanciones;

                -- Reiniciar contador de lote
                v_batch_counter := 0;

                RAISE NOTICE 'Procesados % registros para empleado % - Tiempo transcurrido: % segundos',
                    v_total_procesados, v_per_id, EXTRACT(EPOCH FROM (clock_timestamp() - v_start_time));
            END IF;
        END LOOP;

        -- Si quedan registros en la tabla temporal, insertarlos
        IF v_batch_counter > 0 THEN
            INSERT INTO tbl_cp_asistencia(
                att_id, att_per_id, att_fecha, att_dia, att_ing1, att_sal1, att_ing2, att_sal2,
                att_id_lic_ing1, att_id_lic_sal1, att_id_lic_ing2, att_id_lic_sal2,
                att_min_atraso, att_min_atraso_mayor30, att_min_salio_antes, att_min_extras,
                att_tipo_observado, att_id_horario, att_id_horario_esp, att_edificio
            )
            SELECT
                nextval('seq_tbl_cp_asistencia'), att_per_id, att_fecha, att_dia,
                att_ing1, att_sal1, att_ing2, att_sal2,
                att_id_lic_ing1, att_id_lic_sal1, att_id_lic_ing2, att_id_lic_sal2,
                att_min_atraso, att_min_atraso_mayor30, att_min_salio_antes, att_min_extras,
                att_tipo_observado, att_id_horario, att_id_horario_esp, att_edificio
            FROM tmp_asistencia;

            -- Insertar sanciones en bloque
            INSERT INTO tbl_cp_sanciones
            SELECT * FROM tmp_sanciones;

            -- Limpiar tablas temporales
            TRUNCATE TABLE tmp_asistencia;
            TRUNCATE TABLE tmp_sanciones;

            -- Reiniciar contador de lote
            v_batch_counter := 0;
        END IF;
    END LOOP;

    CLOSE cur_codigos_optimizado;

    -- Registrar cierre mensual
    IF NOT EXISTS (
        SELECT 1 FROM tbl_cp_cierre_mensual
        WHERE cm_fecha_inicio = p_fecha1
          AND cm_fecha_final = p_fecha2
          AND cm_estado = 'V'
    ) THEN
        INSERT INTO tbl_cp_cierre_mensual(
            cm_id, cm_fecha_inicio, cm_fecha_final, cm_estado
        )
        VALUES(
            nextval('seq_tbl_cp_cierre_mensual'), p_fecha1, p_fecha2, 'V'
        );
    END IF;

    -- Limpiar tablas temporales
    DROP TABLE IF EXISTS tmp_personal_a_procesar;
    DROP TABLE IF EXISTS tmp_tolerancia;
    DROP TABLE IF EXISTS tmp_feriados;
    DROP TABLE IF EXISTS tmp_horarios_especiales;
    DROP TABLE IF EXISTS tmp_vacaciones;
    DROP TABLE IF EXISTS tmp_licencias;
    DROP TABLE IF EXISTS tmp_asignacion_horario;
    DROP TABLE IF EXISTS tmp_asistencia;
    DROP TABLE IF EXISTS tmp_sanciones;
    DROP TABLE IF EXISTS tmp_marcaciones;

    RAISE NOTICE 'Proceso completado exitosamente. Total registros procesados: %. Tiempo total: % segundos',
        v_total_procesados, EXTRACT(EPOCH FROM (clock_timestamp() - v_start_time));
END;
$$;