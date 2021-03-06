
/*
 * * * * * * * * * * LICENCIA * * * * * * * * * * * * * * * * * * * * *

Copyright(C) 2015
pensum Universtiario de Tecnología Dr. Federico Rivero Palacio

Este programa es Software Libre y usted puede redistribuirlo y/o modificarlo
bajo los términos de la versión 3.0 de la Licencia Pública General (GPLv3)
publicada por la Free Software Foundation (FSF), es distribuido sin ninguna
garantía. Usted debe haber recibido una copia de la GPLv3 junto con este
programa, sino, puede encontrarlo en la página web de la FSF, 
específicamente en la dirección http://www.gnu.org/licenses/gpl-3.0.html

 * * * * * * * * * * ARCHIVO * * * * * * * * * * * * * * * * * * * * *

Nombre: estudiante.js
Diseñador:Jean Pierre Sosa.
Programador:Jean Pierre Sosa.
Lider de proyecto: Johan Alamo (johan.alamo@gmail.com)
Fecha:10-1-16
Descripción:  
	Este es el javascript del módulo error, encargado de todas las 
	llamadas AJAX, objetos DOM y validaciones de dicho módulo. 

 * * * * * * * * Cambios/Mejoras/Correcciones/Revisiones * * * * * * * *
Diseñador - Programador /   Fecha   / Descripción del cambio
   

 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
*/

$(document).ready(function() {
	verEmpleado();
	if($('#pantalla').val()=="principal"){
		NuevoEmpleado();
		verInstitutoEm2(); 
		verEstadoEm2(); 
		verPNFEm2();
	}
	setTimeout(function() {

		var accion =getVarsUrl().accion;
		if(accion=="V")
			bloquearCamposEmpleado();
	
	}, 1500);
} );



function antesPreGuardarEmpleado(){
	var bool=true;

	if($("#empleado #selectInstituto").val()=="seleccionar"){
		mostrarMensaje("debe de seleccionar un Instituto",2);
		bool=false;
	}
	else if(!validarFecha("#fec_ini_empleado",true)){
		mostrarMensaje("debe de seleccionar la fecha de inicio",2);
		bool=false;
	}	
	else if($("#eempleado #selectPNF").val() =="seleccionar"){
		mostrarMensaje("debe de seleccionar un Pensum",2);
		bool=false;
	}	
	else if($("#empleado #selectEstado").val()=="seleccionar"){
		mostrarMensaje("debe de seleccionar un estado",2);
		bool=false;
	}
	else if(!validarFecha('#fec_ini_empleado',true)){
		mostrarMensaje("debe de introducir una fecha valida valida",2);
		bool=false;
	}
	else if(!validarFecha('#fec_fin_empleado',false)){
		mostrarMensaje("debe de introducir una fecha fin valida",2);
		bool=false;
	}
	else if(!$('#es_ministerio').prop('checked') 
			&& !$('#es_jef_pensum').prop('checked')
			&& !$('#es_jef_con_estudio').prop('checked')
			&& !$('#Docente').prop('checked')){
		mostrarMensaje("debe de seleccionar un cargo",2);
		bool=false;
	}
	else if($("#fec_fin_empleado").val()){
		var fecha =$("#fec_ini_empleado").val().split("/");
		var fechFin=$("#fec_fin_empleado").val().split("/");
		fechFin=new Date (fechFin[2],fechFin[1],fechFin[0]);
		fecha= new Date(fecha[2],fecha[1],fecha[0]);
		if(fechFin<=fecha){
			bool=false;	
			mostrarMensaje("La fecha de inicio no puede ser mayor a la fecha fin.",2);
		}
	}

	if(bool)
		preGuardarEmpleado();
}

function verEmpleado (codi,codpersona){

	if(!$("#cod_persona").val())
		codpersona=getVarsUrl().persona;

	else if($("#cod_persona").val())
		codpersona=$("#cod_persona").val();




	var arr = Array("m_modulo"	,	"empleado",
					"m_accion"	,	"listar",
					"codPersona",	codpersona,
					"codi"		,	codi
					);
	
	ajaxMVC(arr,montarEmpleado,error);

}

function montarEmpleado(data){
	var acu=0;
	cadena="";
	cadena+='<tbody id="listarEmpleado">';
	if(data.empleado!=null){
		for(var x=0; x<data.empleado.length; x++)
		{
			acu=x+1;
			if(data.codi==data.empleado[x]['codigo'])
				cadena+='<tr class="pointer" onclick="modificarEmpleado('+data.empleado[x]['codigo']+'); verEmpleado('+data.empleado[x]['codigo']+'); "  id="'+data.empleado[x]['codigo']+'" style="background-color:#E5EAEE;">';
			else
				cadena+='<tr class="pointer" onclick="modificarEmpleado('+data.empleado[x]['codigo']+'); verEmpleado('+data.empleado[x]['codigo']+'); "  id="'+data.empleado[x]['codigo']+'">';
			cadena+='<a href="#"><td>'+acu+'</td>';
			cadena+='<td>'+data.empleado[x]['codigo']+'</td>';
			cadena+='<td>'+data.empleado[x]['fec_inicios']+'</td>';
			if(data.empleado[x]['fec_final'])
				cadena+='<td>'+data.empleado[x]['fec_final']+'</td>';
			else
				cadena+='<td>-</td>';
			cadena+='<td>'+data.empleado[x]['nombre']+'</td>';
			cadena+='<td>'+data.empleado[x]['nom_instituto']+'</td>';
			cadena+='<td>'+data.empleado[x]['nom_pensum']+'</td>';	
			if(data.empleado[x]['es_jef_pensum'])							 
				cadena+='<td tile="Jefe de pensum" >SI</td>';
			else
				cadena+='<td tile="Jefe de pensum" >NO</td>';
			
			if(data.empleado[x]['es_jef_con_estudio'])
				cadena+='<td title="Jefe de Control de Estudio">SI</td>';
			else
				cadena+='<td title="Jefe de Control de Estudio">NO</td>';
			
			if(data.empleado[x]['es_ministerio'])
				cadena+='<td title="Personal del Ministerio">SI</td>';
			else
				cadena+='<td title="Personal del Ministerio">NO</td>';
			
			if(data.empleado[x]['es_docente'])
				cadena+='<td id="Docente" title="Docente">SI</td>';
			else
				cadena+='<td id="Docente" title="Docente">NO</td>';

			if(data.empleado[x]['observaciones']){
				if(data.empleado[x]['observaciones'].length>25){
					var info = data.empleado[x]['observaciones'].slice(0,25)+"...";
					
					cadena+='<td id="Observaciones">'+info+'</td>';
				}
				else
					cadena+='<td id="Observaciones">'+data.empleado[x]['observaciones']+'</td>';
			}
			else
				cadena+='<td> - </td> ';
			cadena+='</a></tr>';
		}
	}
	cadena+="</tbody>";

	$("#listarEmpleado").remove();
	$(cadena).appendTo('#tablaEmpleado');
}
/**
* Funcion Java Script que permite guardar los datos de a un empleado
* para que luego sean almacenados en la base de datos. Los Datos son enviados
* por ajax.
*/


function preGuardarEmpleado(){

	var codigo="";

	if($("#cod_persona").val() && getVarsUrl().persona == '-1')
		codigo=$("#cod_persona").val();
	else if(getVarsUrl().persona != '-1')
		codigo=getVarsUrl().persona;
	else
		ccodigo=$("#cod_persona").val();

	var arr = Array("m_modulo"	,	"empleado",
					"m_accion"	,	"listar",
					"codPersona",	codigo
					);

	ajaxMVC(arr,compararDatosEmpleados,error);

}

function compararDatosEmpleados(data){

	var bool= true;
	var boolAux=false;
	var boolNada=true;
	var acu=0;
	var mensaje="";
	var i=0;		

	if(data.empleado){
		for(var x=0; x<data.empleado.length; x++){
			acu=x+1;
			if((data.empleado[x]['cod_instituto'] == $("#empleado #selectInstituto").val()
				&& data.empleado[x]['cod_pensum'] == $("#empleado  #selectPNF").val()
				&& data.empleado[x]['fec_inicios'] == $("#fec_ini_empleado").val() )	
				&& (data.empleado[x]['codigo'] != $("#cod_empleado").val())		
			){		
				
				mensaje+="Ya esta modificacion se realizo anteriormente. Si desea afectuarla puede";
				mensaje+=" eliminar la informacion que se encuentra en la fila N° "+acu+"."; 		
				mostrarMensaje(mensaje,2);	
				boolNada=false;				
				break;						
			}
			else if(data.empleado[x]['fec_inicios'] == $("#fec_ini_empleado").val()
					&& data.empleado[x]['codigo'] != $("#cod_empleado").val()){
				
				mensaje+="Ya esta modificacion se realizo anteriormente. Si desea afectuarla puede";
				mensaje+=" eliminar la informacion que se encuentra en la fila N° "+acu+" o cambie la fecha"; 
				mensaje+=" de inicio.";	
				mostrarMensaje(mensaje,2);	
				boolNada=false;
				break;			
			}
			else if( data.empleado[x]['es_jef_con_estudio'] == $('#es_jef_con_estudio').prop('checked')
					&& data.empleado[x]['es_ministerio'] == $('#es_ministerio').prop('checked')
					&& data.empleado[x]['es_jef_pensum'] == $('#es_jef_pensum').prop('checked')
					&& data.empleado[x]['es_docente'] == $('#Docente').prop('checked')
					&& data.empleado[x]['cod_estado'] == $("#empleado  #selectEstado").val()
					&& data.empleado[x]['codigo'] == $("#cod_empleado").val()
					&& data.empleado[x]['fec_inicios'] == $("#fec_ini_empleado").val()
					&& data.empleado[x]['cod_instituto'] == $("#empleado #selectInstituto").val()
					&& data.empleado[x]['cod_pensum'] == $("#empleado  #selectPNF").val()
					&& (data.empleado[x]['fec_final']!= $("#fec_fin_empleado").val()
					||	data.empleado[x]['observaciones']!=$("#obs_empleado").val())){
						bool=true;
						break;
			}			
			else if((data.empleado[x]['cod_estado'] != $("#empleado  #selectEstado").val()
						|| data.empleado[x]['es_jef_con_estudio'] != $('#es_jef_con_estudio').prop('checked')
						|| data.empleado[x]['es_ministerio'] != $('#es_ministerio').prop('checked')
						|| data.empleado[x]['es_jef_pensum'] != $('#es_jef_pensum').prop('checked')
						|| data.empleado[x]['es_docente'] != $('#Docente').prop('checked'))					
						&& data.empleado[x]['codigo'] == $("#cod_empleado").val()){
				bool=true;				
				boolAux=true; 
				break;	
			}
			else if((data.empleado[x]['cod_instituto'] != $("#empleado #selectInstituto").val()
					|| data.empleado[x]['cod_pensum'] != $("#empleado  #selectPNF").val()
					|| data.empleado[x]['fec_inicios'] != $("#fec_ini_empleado").val() )	
					&& data.empleado[x]['codigo'] == $("#cod_empleado").val()){
					bool=false;
					break;
			}			
			else 
				bool=false;
		}
	}
	else
		bool=false;		

	//alert(bool+" ** "+boolAux);

	if(boolNada){
		if(boolAux && data.empleado)
			preDobleGuardar(bool,boolAux,data.empleado[i]);
		else if(data.empleado && bool)
			preDobleGuardar(bool,null,data.empleado[i]);
		else
			preDobleGuardar(false);

		setTimeout(function(){
			verEmpleado();			
		}, 200);
	}
}


function preDobleGuardar(bool,boolAux,data){

	if(boolAux && boolAux){
		guardarEmpleadoAux(data,boolAux);
		guardarEmpleado(bool,data);
	}
	else if(bool)
		guardarEmpleadoAux(data,boolAux);
	else
		guardarEmpleado(bool);
}

function guardarEmpleadoAux(data,boolAux){
	
	var fecha='';
	
		if($("#fec_fin_empleado").val() || !boolAux) //el boolaux se puso nuevo
			fecha=$("#fec_fin_empleado").val();
		else
			fecha=fecActual();	

	var arr = Array("m_modulo"	,	"empleado",
					"m_accion"	,	"agregar",	
					"codPersona",  data['cod_persona'],
					"codEstado", data['cod_estado'],
					"codEmpleado",  data['codigo'],
					"codInstituto", data['cod_instituto'],
					"codPensum", data['cod_pensum'],
					"fecInicio", data['fec_inicios'],
					"fecFin", fecha,
					"observaciones", $("#obs_empleado").val(),
					"es_jef_con_estudio",data['es_jef_con_estudio'],
					"es_ministerio",	data['es_ministerio'],
					"es_jef_pensum",	data['es_jef_pensum'],
					"Docente",			data['es_docente']
				);

	ajaxMVC(arr,succAgregarEmpleado,error);

}

function guardarEmpleado(bool,data){
	var fec_ini=$("#fec_ini_empleado").val();
	var fec_fin=null;
	
	if(bool && fec_ini){	
		if($("#fec_fin_empleado").val())
			fec_ini=$("#fec_fin_empleado").val();
		else if(data['fec_inicios']!=fec_ini)
			fec_ini=$("#fec_ini_empleado").val();
		else
			fec_ini=fecActual();		
	}

	if(!bool)
		fec_fin=$("#fec_fin_empleado").val();

	var arr = Array("m_modulo"	,	"empleado",
					"m_accion"	,	"agregar",	
					"codPersona",  $("#codigoPersona").val(),
					"codEstado", $("#empleado #selectEstado").val(),
					"codInstituto", $("#empleado #selectInstituto").val(),
					"codPensum", $("#empleado #selectPNF").val(),
					"fecInicio", fec_ini,
					"fecFin", fec_fin,
					"observaciones", $("#obs_empleado").val(),
					"es_jef_con_estudio",$('#es_jef_con_estudio').prop('checked'),
					"es_ministerio",	$('#es_ministerio').prop('checked'),
					"es_jef_pensum",	$('#es_jef_pensum').prop('checked'),
					"Docente",			$('#Docente').prop('checked')
				);

	ajaxMVC(arr,succAgregarEmpleado,error);
	
}

function succAgregarEmpleado(data){

	if(data.estatus>0){
		if(data.codEmpleado)
			$("#cod_empleado").val(data.codEmpleado);

		mostrarMensaje(data.mensaje,1);
	}
	else
		mostrarMensaje(data.mensaje,2);
}

/**
* Funcion Java Script que permite listar Todos los institutos
* para que luego sea mostado en un select. los datos son enviados
* por ajax para que se haga la consulta a la base de datos y mostrar 
* los resultados en la funcion montarSelectInstituto().
*/
function verInstitutoEm2(){

	var arr = Array("m_modulo"	,	"instituto",
					"m_accion"	,	"listar"
					);
	ajaxMVC(arr,montarSelectInstitutoE,error);	
}




/**
* Funcion Java Script que permite mostrar un select con
* los institutos y es concatenado a un  div en la vista HTML
*/
function montarSelectInstitutoE(data){

	var cadena = "";
		$("#empleado #selectInsEm").remove();
		cadena+="<div id='selectInsEm'> institutos ";
		cadena += "<select onchange='verPNFEm2();' class='selectpicker' id='selectInstituto' title='institutos' data-live-search='true' data-size='auto' data-max-options='12' >"; 
		cadena += "<option value='seleccionar' >Seleccionar</option>";
	for(var x=0; x<data.institutos.length;x++)
	{
		if(data.datos){
			if((data.datos[0].emp_inst != data.institutos[x]["codigo"] || !data.datos[0].emp_inst ) && (data.datos[0].est_inst != data.institutos[x]["codigo"] || !data.datos[0].est_inst ) )
				cadena += '<option value="'+data.institutos[x]["codigo"]+'">'+data.institutos[x]["nom_corto"]+'</option>';
			else{
				cadena += '<option selected value="'+data.institutos[x]["codigo"]+'">'+data.institutos[x]["nom_corto"]+'</option>';
				setTimeout(function(){ 
					verPNFEm2();
				}, 1000);
			}
		}
		else
			cadena += '<option value="'+data.institutos[x]["codigo"]+'">'+data.institutos[x]["nom_corto"]+'</option>';
	}
	cadena+="</select></div>";

	$(cadena).appendTo('.selectInstitutoEm');
	activarSelect();					
}

function verPNFEm2(){
	
		var arr = Array("m_modulo"	,	"pensum",
						"m_accion"	,	"buscarPorInstituto",
						"codigo"	,	$("#empleado #selectInstituto").val()
						);
		ajaxMVC(arr,montarSelectPNFE,error);	
}


/**
* Funcion Java Script que permite mostrar un select con
* los PNF y es concatenado a un  div en la vista HTML
*/
function montarSelectPNFE(data){
	var cadena = "";
	$("#empleado #selectPensumaEm").remove();
	cadena+="<div id='selectPensumaEm'> Pensum ";
	cadena += "<select class='selectpicker' id='selectPNF' title='pensum' data-live-search='true' data-size='auto' data-max-options='12' >"; 
	cadena += "<option value='seleccionar'>Seleccionar</option>";
	if(data.pensum){
		for(var x=0; x<data.pensum.length;x++)
		{
			cadena += '<option value="'+data.pensum[x]["codigo"]+'">'+data.pensum[x][2]+'</option>';
		}
	}
	cadena +="</select></div>";
	$(cadena).appendTo('.selectPensumEm');
	activarSelect();					
}

/**
* Funcion Java Script que permite listar Todos los estados que posee un actor
* para que luego sea mostado en un select. los datos son enviados
* por ajax para que se haga la consulta a la base de datos y mostrar 
* los resultados en la funcion mmontarSelectEstado().
*/
function verEstadoEm(){
	
	var arr = Array("m_modulo"	,	"empleado",
					"m_accion"	,	"listar",
					"estado"	,	$("#selectEstado").val(),
					"pnf"		,	$("#selectPNF").val(),
					"instituto"	,	$("#selectInstituto").val(),
					"tipo_persona",	"empleado",
					"campo",		$("#campo").val()	
					);		
	ajaxMVC(arr,montarSelectEstadoPersona,error);
}

function verEstadoEm2(){

	var arr = Array("m_modulo"	,"empleado",
					"m_accion"	,"listarEstado"
				);	
	
	ajaxMVC(arr,montarSelectEstadoEm,error);	
}

/**
* Funcion Java Script que permite mostrar un select con
* los estados y es concatenado a un  div en la vista HTML
*/
function montarSelectEstadoEm(data){

	var cadena = "";
	$("#empleado #selectEstadosEm").remove();
	cadena+="<div id='selectEstadosEm'> Estado";
	cadena += "<select name='selectEstado' class='selectpicker' id='selectEstado' title='Estado' data-live-search='true' data-size='auto' data-max-options='12' >"; 
	cadena += "<option value='seleccionar'>Seleccionar</option>";
	for(var x=0; x<data.estado.length;x++)
	{		
		cadena += '<option value="'+data.estado[x]["codigo"]+'">'+data.estado[x]["nombre"]+'</option>';
	}
	cadena +="</select></div>";

	$(cadena).appendTo('.selectEstadoEm');
	activarSelect();					
}


/**
* Funcion Java Script que permite listar Todos los estudiantes
* para que luego sean mostradas. los datos son enviados
* por ajax para que se haga la consulta a la base de datos y mostrar 
* los resultados en la funcion montarPersona().
*/
function montarPersonaEmpleado(){

	cadena="";
	cadena+='<tbody id="listarPersonaEmpleado">';
	for(var x=0; x<data.persona.length; x++)
	{
		if(data.persona[x]['apellido2']!=null)
			var nombre=data.persona[x]['apellido2'];
		else
			var nombre="";

		if(data.persona[x]['nombre2']!=null)
			var apellido=data.persona[x]['nombre2'];
		else
			var apellido="";
		cadena+="<tr>";
		cadena+="<td><input id='cod_persona' type='radio' name='cod_persona' value='"+data.persona[x]['codigo']+"'>"+data.persona[x]['codigo']+"</td>";
		cadena+="<td>"+data.persona[x]['cedula']+"</td>";
		cadena+="<td>"+data.persona[x]['apellido1']+" "+nombre+"</td>";
		cadena+="<td>"+data.persona[x]['nombre1']+" "+apellido+"</td>";
		cadena+="<td>"+data.persona[x]['cor_personal']+"</td>";
	}
	cadena+"</tbody>";

	$("#listarPersona").remove();
	$(cadena).appendTo('#primeraTabla');
}

/**
* Funcion Java Script que permite listar a un empleado en el HTML para
* que lugo se modifique su informacionde la base de datos. Los Datos son enviados
* por ajax.
*/

function modificarEmpleado(cod_empleado,cod_persona){
	
	if(!cod_persona && $("#cod_persona").val())
		cod_persona=$("#cod_persona").val();

	if(!cod_empleado && $("#cod_empleado").val())
		cod_empleado=$("#cod_empleado").val();


	var arr = Array("m_modulo"	,	"empleado",
					"m_accion"	,	"listar",
					"codPersona",   cod_persona,
					"codEmpleado",  cod_empleado									
					);
		
	ajaxMVC(arr,succMontarModificarEmpleado,error);

}

/**
 * esta funcion JavaScript permite signar los datos obtenido en la
 * consuta  la base de datos y colocarlos en la vista HTML
 * de esta manera el usuario podra modificar los datos de la empleado
 */
function succMontarModificarEmpleado (data){

//	verInstitutoEm2(); verEstadoEm2(); 
	console.log(data.empleado);
	$("#cod_empleado").val(data.empleado[0]['codigo']);
	$("#cod_persona").val(data.empleado[0]['cod_persona']);
	setTimeout(function(){
		$("#empleado #selectEstado").val(data.empleado[0]['cod_estado']);
		$("#empleado #selectInstituto").val(data.empleado[0]['cod_instituto']);	

	verPNFEm2();
	}, 950);
	setTimeout(function(){ 
		$("#empleado #selectPNF").val(data.empleado[0]['cod_pensum']);
		if(getVarsUrl().accion=="V"){
			$("#empleado #selectInstituto").prop("disabled",true);
			$("#empleado #selectPNF").prop("disabled",true);
			$("#empleado #selectEstado").prop("disabled",true);
		}
		$('#empleado #selectInstituto').selectpicker('refresh'); 
		$('#empleado #selectPNF').selectpicker('refresh');  
		$('#empleado #selectEstado').selectpicker('refresh');   
	}, 2000);
	$("#fec_ini_empleado").val(data.empleado[0]['fec_inicios']);
	if(data.empleado[0]['fec_final'])
		$("#fec_fin_empleado").val(data.empleado[0]['fec_final']);
	else 
		$("#fec_fin_empleado").val("");
	$("#obs_empleado").val(data.empleado[0]['observaciones']);	
	$("#es_ministerio").prop( "checked",data.empleado[0]['es_ministerio']);
	$("#es_jef_pensum").prop( "checked",data.empleado[0]['es_jef_pensum']);
	$("#es_jef_con_estudio").prop( "checked",data.empleado[0]['es_jef_con_estudio']);
	$("#Docente").prop( "checked",data.empleado[0]['es_docente']);
}

function NuevoEmpleado (){

	$("#cod_empleado").val("");
	$("#empleado #selectPNF").val("seleccionar");
	$('#empleado #selectPNF').selectpicker('refresh');
	$("#empleado #selectEstado").val("seleccionar");
	$("#empleado #selectEstado").selectpicker('refresh');
	$("#empleado #selectInstituto").val("seleccionar");	
	$('#empleado #selectInstituto').selectpicker('refresh');
	$("#fec_ini_empleado").val(fecActual());
	$("#fec_fin_empleado").val("");
	$("#obs_empleado").val("");	
	$("#es_ministerio").prop( "checked",false);
	$("#es_jef_pensum").prop( "checked",false);
	$("#es_jef_con_estudio").prop( "checked",false);
	$("#Docente").prop( "checked",false);
}

function bloquearCamposEmpleado(){
	$("#cod_empleado").prop('disabled',true);
	$("#empleado #selectPNF").prop('disabled',true);
	$('#empleado #selectPNF').prop('disabled',true);
	$("#empleado #selectEstado").prop('disabled',true);
	$("#empleado #selectEstado").prop('disabled',true);
	$("#empleado #selectInstituto").prop('disabled',true);
	$('#empleado #selectInstituto').prop('disabled',true);
	$("#fec_ini_empleado").prop('disabled',true);
	$("#fec_fin_empleado").prop('disabled',true);
	$("#obs_empleado").prop('disabled',true);
	$("#es_ministerio").prop('disabled',true);
	$("#es_jef_pensum").prop('disabled',true);
	$("#es_jef_con_estudio").prop('disabled',true);
	$("#Docente").prop('disabled',true);
	$(".selectpicker").selectpicker("refresh");
}

/**
* Funcion Java Script que permite borrar a un  estudiante
* de la base de datos. Los Datos son enviados
* por ajax.
*/
function borrarEmpleado(){

	var arr = Array("m_modulo"	,	"empleado",
					"m_accion"	,	"eliminar",
					"codEmpleado",  $("#cod_empleado").val()									
					);
		
	ajaxMVC(arr,succMontarEliminarEmpleado,error);

}

function succMontarEliminarEmpleado (data){

	if(data.estatus>0){
		mostrarMensaje(data.mensaje,1);
		setTimeout(function(){verEmpleado();}, 300);
		$("#cod_empleado").val('');
	}
	else
		mostrarMensaje(data.mensaje,2);
}


function error(data){	
	console.log(data);
	mostrarMensaje("Error de comunicación con el servidor.",2);
}
