<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

use App\Http\Controllers\Controller;

use App\Models\Acta;
use App\Models\HistorialActas;
use DB;

class ActaCtr extends Controller
{
    public function index(){
        return Acta::orderBy('fecha', 'asc')->get();
    }
    
    public function store(Request $request){
        try {           
            $data = $request->all();
            $acta = DB::select("select * from acta where acta='".$data['acta']
                    ."' and YEAR(fecha)=YEAR('".$data['fecha']."')");
            if( empty($acta) ){
                $acta = new Acta();
                $acta->acta = $data['acta'];
                $acta->fecha = $data['fecha'];
                $acta->save();                
                return JsonResponse::create(array('state'=>'OK', 'message' => "Acta Guardada Correctamente", "request" => $acta), 200);                
            } else {
                return JsonResponse::create(array('state'=>'KO', 'message' => "Ya existe una acta para el año señalado", "request" => ''), 200);             
            }           
                                                  
        } catch (Exception $exc) {
            return JsonResponse::create(array('state'=>'KO','message' => "No se pudo guardar el Acta", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }        
    }
    
    public function update(Request $request,$id){
        try {           
            $data = $request->all();
            $acta = Acta::find($id);
            if( ! empty($acta) ){
                $acta->acta = $data['acta'];
                $acta->fecha = $data['fecha'];
                $acta->save();                
                return JsonResponse::create(array('state'=>'OK', 'message' => "Acta Guardada Correctamente", "request" => $acta), 200);                
            } else {
                return JsonResponse::create(array('state'=>'KO', 'message' => "El acta no existe", "request" => ''), 200);             
            }           
                                                  
        } catch (Exception $exc) {
            return JsonResponse::create(array('state'=>'KO','message' => "No se pudo guardar el Acta", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }        
    }
    
    public function upload(Request $request){
        if ($request->hasFile('file')) {
            $data = $request->all();
            $acta = Acta::find($data['idacta']);
            
            if( ! empty($acta) ){
                $file = $request->file('file');
                $file->move( public_path().'/actas', $acta->acta.'_'.$acta->fecha.'.pdf' );
                $acta->path = 'actas/'.$acta->acta.'_'.$acta->fecha.'.pdf';
                $acta->save();
                return 'Documento cargado';
            } else {
                return 'No se guardo el documento';                
            }
            
        }else{
            return 'Documento no cargado';
        } 
        //return $request->file();
    }
    
    public function show($id){
        $acta = Acta::find($id);
        if( !empty($acta) ){
            return JsonResponse::create(array('state'=>'OK', 'message' => "", "request" => $acta), 200);            
        } else{
            return JsonResponse::create(array('state'=>'KO', 'message' => "Acta no encontrada", "request" => ''), 200);             
        }
        
    } 
    
    public function getActas(){
        $vigencias = DB::select('SELECT YEAR(fecha) as vigencia FROM afiliadosdb.acta group by YEAR(fecha)');
        $lActas = array();
        foreach ($vigencias as &$value) {
            $actas = DB::select("SELECT * FROM afiliadosdb.acta where YEAR(fecha)='". $value->vigencia ."'");
            $aux = array( "vigencia"=> $value->vigencia,"actas" => $actas);
            array_push( $lActas, $aux);
        }
        return $lActas;
    }
    
    public function storeHisActas(Request $request){
        try {
            $data = $request->all();        
            $hisActas = HistorialActas::where('afiliado','=',$data["afiliado"])
                    ->where('tActa','=',$data["tActa"])
                    ->where('estado','=','A')
                    ->orderBy('fecha', 'desc')->first();
            if( ! empty($hisActas) ) {
                $hisActas->estado = "I";
                $hisActas->save();
            }
            
            $hisActas = new HistorialActas();
            $hisActas->estado = "A";
            $hisActas->afiliado = $data["afiliado"];
            $hisActas->Acta = $data["Acta"];
            $hisActas->fecha = $data["fecha"];
            $hisActas->tActa = $data["tActa"];
            $hisActas->save();
            
            return JsonResponse::create(array('state'=>'OK', 'message' => "Guardado historial del acta ", "request" => $hisActas), 200);
            
        } catch (Exception $exc) {
            return JsonResponse::create(array('state'=>'KO','message' => "No se pudo guardar el historial del acta", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
        
    }
    
}
