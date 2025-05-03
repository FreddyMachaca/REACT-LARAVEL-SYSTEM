import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    flexDirection: 'column',
    padding: 30
  },
  header: {
    flexDirection: 'row',
    marginBottom: 5,
    borderBottom: '1px solid #000',
    paddingBottom: 10,
  },
  logoContainer: {
    width: 80,
    marginRight: 10,
  },
  logo: {
    width: 70,
    height: 70,
  },
  headerTextContainer: {
    flex: 1,
    textAlign: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  reportTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  reportSubtitle: {
    fontSize: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
  headerDate: {
    position: 'absolute',
    fontSize: 8,
    top: 0,
    right: 0,
    textAlign: 'right',
  },
  employeeInfo: {
    marginBottom: 5,
    paddingBottom: 2,
    borderBottom: '1px solid #000',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#000',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCol: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderBottomWidth: 1,
    borderRightWidth: 1,
    padding: 2,
    fontSize: 8,
  },
  tableHeader:{
    borderStyle: 'solid',
    borderColor: '#000',
    borderTopWidth: 1,
  },
  firstCol: {
    borderStyle: 'solid',
    borderColor: '#000',
    borderLeftWidth: 1,
  },
  headerCol: {
    textAlign: 'center',
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
  },
  footerSummary: {
    marginTop: 5,
    fontSize: 10,
  },
  colFecha: { 
    width: '60px',
    textAlign: 'center'
  },
  colDia: { width: '60px' },
  colHora: { 
    width: '80px',
    textAlign: 'center'
  },
  colMin: { 
    width: '40px',
    textAlign: 'center'
  },
  colObs: { width: '150px' },
});

const ReporteAsistenciaTemplate = ({ data, personaInf }) => {
  const getMesAnio = () => {
    if (data && data.length > 0) {
      try {
        const fecha = new Date(data[0].att_fecha);
        return format(fecha, 'MMMM/yyyy', { locale: es }).toUpperCase();
      } catch (e) {
        return 'ABRIL/2016'; // Valor por defecto
      }
    }
    return 'ABRIL/2016'; // Valor por defecto
  };

  const calcularTotales = () => {
    let totalMinAtraso = 0;
    let totalMinTrabajo = 0;
    let totalNoMarcEntrada = 0;
    let totalNoMarcSalida = 0;
    let totalMinTrabajoEsp = 0;
    
    data.forEach(item => {
      totalMinAtraso += item.min_atraso || 0;
      totalMinTrabajo += item.min_trabajo || 0;
      totalMinTrabajoEsp += item.min_trabajo_esp || 0;
      if (item.marca_entrada_manana === null && item.marca_entrada_tarde === null) totalNoMarcEntrada++;
      if (item.marca_salida_manana === null && item.marca_salida_tarde === null) totalNoMarcSalida++;
    });
    
    return {
      totalMinAtraso,
      totalMinTrabajo,
      totalNoMarcEntrada,
      totalNoMarcSalida,
      totalMinTrabajoEsp,
    };
  };

  const formatName = () => {
    return `${personaInf.per_nombres} ${personaInf.per_ap_paterno ?? ''} ${personaInf.per_ap_materno??''}`;
  }

  const totales = calcularTotales();
  const nombre_completo = formatName();
  
  // const formatMinutesToTime = (minutes) => {
  //   const dias = Math.floor(minutes / (24 * 60));
  //   const horas = Math.floor((minutes % (24 * 60)) / 60);
  //   const mins = minutes % 60;
  //   return `${dias} d, ${horas} h, ${mins} m`;
  // };

  // const formatMinutesToWorkTime = (minutes) => {
  //   const FULL_DAY_MINUTES = 480;
  //   const HALF_DAY_MINUTES = 240;
  
  //   const dias = Math.floor(minutes / FULL_DAY_MINUTES);
  //   let restante = minutes % FULL_DAY_MINUTES;
  
  //   let medioDia = 0;
  //   if (restante >= HALF_DAY_MINUTES) {
  //     medioDia = 1;
  //     restante -= HALF_DAY_MINUTES;
  //   }
  
  //   const horas = Math.floor(restante / 60);
  //   const mins = restante % 60;
  
  //   return `${dias} d, ${medioDia ? '½ d, ' : ''}${horas} h, ${mins} m`;
  // };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Cabecera */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              src="/images/gobierno_autonomo_de_la_paz.jpeg" 
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>GOBIERNO AUTÓNOMO MUNICIPAL DE LA PAZ</Text>
            <Text style={styles.headerSubtitle}>DIRECCIÓN DE GESTIÓN DE RECURSOS HUMANOS</Text>
            <Text style={styles.headerSubtitle}>UNIDAD DE ADMINISTRACIÓN DE PERSONAL</Text>
            <Text style={styles.reportTitle}>REPORTE INDIVIDUAL DE ASISTENCIA - DETALLADA POR MES</Text>
            <Text style={styles.reportSubtitle}>CORRESPONDIENTE AL MES DE {getMesAnio()}</Text>
            
            <Text style={styles.headerDate}>
              {format(new Date(), 'dd/MM/yyyy')}
              {'\n'}
              {format(new Date(), 'HH:mm')}
            </Text>
          </View>
        </View>

        <View style={styles.employeeInfo}>
          <Text>
            <Text style={{ fontWeight: 'bold' }}>{personaInf.per_id}</Text> {nombre_completo.toUpperCase()}
          </Text>

          <Text style={{ fontWeight: 'bold' }}>{`CARGO: ${personaInf.cargo_descripcion.trim('')}  ${personaInf.ca_ti_item}${personaInf.ca_num_item}`}</Text>
        </View>

        {/* Fila de encabezado */}
        <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCol, styles.firstCol, styles.headerCol, styles.colFecha]}>Fecha</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colDia]}>Día Semana</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colHora]}>Hora Ingreso Mañana</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colHora]}>Hora Salida Medio Día</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colHora]}>Hora Ingreso Tarde</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colHora]}>Hora Salida Tarde</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colMin]}>Min. Atraso</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colMin]}>Min. Trab.</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colMin]}>No Marc. Ent.</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colMin]}>No Marc. Sal</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colMin]}>Min. Obs.</Text>
            <Text style={[styles.tableCol, styles.headerCol, styles.colObs]}>Observaciones</Text>
        </View>

         {/* Filas de datos */}
         {data.map((item, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            <Text style={[styles.tableCol, styles.firstCol, styles.colFecha]}>{item.att_fecha}</Text>
            <Text style={[styles.tableCol, styles.colDia]}>{item.att_dia}</Text>
            <Text style={[styles.tableCol, styles.colHora]}>{item.marca_entrada_manana || ''}</Text>
            <Text style={[styles.tableCol, styles.colHora]}>{item.marca_salida_manana || ''}</Text>
            <Text style={[styles.tableCol, styles.colHora]}>{item.marca_entrada_tarde || ''}</Text>
            <Text style={[styles.tableCol, styles.colHora]}>{item.marca_salida_tarde || ''}</Text>
            <Text style={[styles.tableCol, styles.colMin]}>{item.min_atraso}</Text>
            <Text style={[styles.tableCol, styles.colMin]}>{item.min_trabajo}</Text>
            <Text style={[styles.tableCol, styles.colMin]}>{item.no_marcado_entrada}</Text>
            <Text style={[styles.tableCol, styles.colMin]}>{item.no_marcado_salida}</Text>
            <Text style={[styles.tableCol, styles.colMin]}>0</Text>
            <Text style={[styles.tableCol, styles.colObs]}>{item.he_descripcion} </Text>
          </View>
        ))}

        <View style={[styles.tableRow, styles.totalRow]}>
          <Text style={[styles.tableCol, styles.firstCol, styles.colFecha]}></Text>
          <Text style={[styles.tableCol, styles.colDia]}></Text>
          <Text style={[styles.tableCol, styles.colHora]}></Text>
          <Text style={[styles.tableCol, styles.colHora]}></Text>
          <Text style={[styles.tableCol, styles.colHora]}></Text>
          <Text style={[styles.tableCol, styles.colHora]}></Text>

          <Text style={[styles.tableCol, styles.colMin]}>{totales.totalMinAtraso}</Text>
          <Text style={[styles.tableCol, styles.colMin]}>{totales.totalMinTrabajo}</Text>
          <Text style={[styles.tableCol, styles.colMin]}>{totales.totalNoMarcEntrada}</Text>
          <Text style={[styles.tableCol, styles.colMin]}>{totales.totalNoMarcSalida}</Text>
          <Text style={[styles.tableCol, styles.colMin]}></Text>
          <Text style={[styles.tableCol, styles.colObs]}></Text>
        </View>

        {/* Resumen de tiempo */}
        {/* <View style={styles.footer}>
          <Text style={styles.footerSummary}>Desglose de Tiempo de Trabajo: {formatMinutesToWorkTime(totales.totalMinTrabajo)}</Text>
          <Text style={styles.footerSummary}>Tiempo Calculado de Trabajo: {formatMinutesToWorkTime(totales.totalMinTrabajoEsp)}</Text>
          <Text style={styles.footerSummary}>Diferencia en Tiempo de Trabajo: {formatMinutesToWorkTime( Math.abs( totales.totalMinTrabajoEsp - totales.totalMinTrabajo ) )}</Text>
        </View> */}

      </Page>
    </Document>
  );
};

export default ReporteAsistenciaTemplate;