<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Controller;

use App\Models\Afiliado;
use DB;

class afiliadoCtr extends Controller
{
    public function index(){
        $afiliados = Afiliado::all();
        
        foreach ($afiliados as &$value) {
            $h = DB::select('SELECT h.acta,h.fecha as fechaActa,h.estado as estadoActa FROM '
                    . "historialactas as h where h.estado='A' limit 1");
            
            $value->acta = "";
            $value->fechaActa = ""; 
            $value->estadoActa = "";
            if( !empty($h) ){
                $value->acta = $h[0]->acta;
                $value->fechaActa = $h[0]->fechaActa; 
                $value->estadoActa = $h[0]->estadoActa;  
            }
        }
        
        return $afiliados;
    }
    
    public function store(Request $request){
        try {           
            $data = $request->all();
            
            $afiliado = Afiliado::where('noIdentificacion','=',$data['noIdentificacion'])->first();
            if( empty($afiliado)  ){
                $afiliado = new Afiliado();
                $afiliado->estado = $data['estado'];
                $afiliado->tPersona = $data['tPersona'];
                $afiliado->nombre = $data['nombre'];
                $afiliado->noIdentificacion = $data['noIdentificacion'];
                $afiliado->matricula = $data['matricula'];
                $afiliado->fecha = $data['fecha'];
                $afiliado->municipio = $data['municipio'];
                $afiliado->direccion = $data['direccion'];
                $afiliado->telefono = $data['telefono'];
                $afiliado->celular = $data['celular'];
                $afiliado->fax = $data['fax'];
                $afiliado->correo = $data['correo'];
                $afiliado->save();
                return JsonResponse::create(array('state'=>'OK', 'message' => "Afiliado Guardado Correctamente", "request" => $afiliado), 200);
                
            }  else {
                return JsonResponse::create(array('state'=>'KO','message' => "El Afiliado ya existe", "request" =>''), 200);
                
            }                                    
                                                  
        } catch (Exception $exc) {
            return JsonResponse::create(array('state'=>'KO','message' => "No se pudo guardar el Afiliado", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }     
        
    }
    
    public function update(Request $request, $id){
        try {
            $data = $request->all();
            $afiliado = Afiliado::find($id);
            if( !empty($afiliado) ){
                $afiliado->estado = $data['estado'];
                $afiliado->tPersona = $data['tPersona'];
                $afiliado->nombre = $data['nombre'];
                $afiliado->noIdentificacion = $data['noIdentificacion'];
                $afiliado->fecha = $data['fecha'];
                $afiliado->municipio = $data['municipio'];
                $afiliado->direccion = $data['direccion'];
                $afiliado->telefono = $data['telefono'];
                $afiliado->celular = $data['celular'];
                $afiliado->fax = $data['fax'];
                $afiliado->correo = $data['correo'];
                $afiliado->save();
                return JsonResponse::create(array('state'=>'OK','message' => "Afiliado Guardado Correctamente", "request" => $afiliado), 200);
            } else {
                return JsonResponse::create(array('state'=>'KO','message' => "El Afiliado no existe", "request" =>''), 200);
            }            
        }  catch (Exception $exc ){
            return JsonResponse::create(array('state'=>'KO','message' => "No se pudo guardar el Afiliado", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }                
    } 
    
    public function destroy($id){
        try {
            $afiliado = Afiliado::find($id);
            $afiliado->delete();

            return JsonResponse::create(array('message' => "Afiliado Borrado Correctamente", "request" => $afiliado), 200);                                                 
        } catch (Exception $exc) {
            return JsonResponse::create(array('message' => "No se pudo Borrar el Censador", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }          
    }

}
