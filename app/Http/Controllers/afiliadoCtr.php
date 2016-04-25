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
        $afiliados = Afiliado::orderBy('municipio', 'asc')->get();
        
        $this->getFechaActaAfi($afiliados);
        
        return array("afiliados"=>$afiliados,
                     "tActivos"=>Afiliado::where('estado','=','A')->count(),
                     "tInactivos"=>Afiliado::where('estado','=','I')->count());
    }
    
    public function getAfixActa(Request $request){
        $data = $request->all();
        
        if ( empty ($data["tActa"]) || empty ($data["idActa"]) ) { /* Tipo de Acta o idActa vacio  */
            return array();        
        } 
        elseif( $data["tActa"] == 'T' ) {
            $afiliados = DB::select("select a.*  
                            from afiliado as a inner join historialactas as h on a.id = h.afiliado
                            where h.estado='A' and h.acta='".$data["idActa"]."' 
                            order by a.municipio asc;");
            $tActivos = DB::select("select count(a.id) as c  
                            from afiliado as a inner join historialactas as h on a.id = h.afiliado
                            where h.estado='A' and a.estado='A' and h.acta='".$data["idActa"]."' 
                            order by a.municipio asc;");
            $tInactivos = DB::select("select count(a.id) as c  
                            from afiliado as a inner join historialactas as h on a.id = h.afiliado
                            where h.estado='A' and a.estado='I' and h.acta='".$data["idActa"]."' 
                            order by a.municipio asc;");
            
        } 
        else {
            $afiliados = DB::select("select a.*  
                            from afiliado as a inner join historialactas as h on a.id = h.afiliado
                            where h.estado='A' and h.acta='".$data["idActa"]."' 
                            and tActa='".$data["tActa"]."' 
                            order by a.municipio asc;");
            $tActivos = DB::select("select count(a.id) as c  
                            from afiliado as a inner join historialactas as h on a.id = h.afiliado
                            where h.estado='A'and a.estado='A' and h.acta='".$data["idActa"]."' 
                            and tActa='".$data["tActa"]."' 
                            order by a.municipio asc;");
            $tInactivos  = DB::select("select count(a.id) as c  
                            from afiliado as a inner join historialactas as h on a.id = h.afiliado
                            where h.estado='A'and a.estado='I' and h.acta='".$data["idActa"]."' 
                            and tActa='".$data["tActa"]."' 
                            order by a.municipio asc;");             
        }
        $this->getFechaActaAfi($afiliados);
        return array("afiliados"=>$afiliados,
                     "tActivos"=>$tActivos[0]->c,
                     "tInactivos"=>$tInactivos[0]->c);              
    }
    
    public function getFechaActaAfi(&$afiliados) {
        foreach ($afiliados as &$value) {
            $h = DB::select('SELECT h.acta,h.fecha as fechaActa,h.estado as estadoActa,h.tActa FROM '
                    . "historialactas as h where h.tActa='A' AND h.estado='A' and afiliado=".$value->id." limit 1");
            
            $h2 = DB::select('SELECT h.acta,h.fecha as fechaActa,h.estado as estadoActa,h.tActa FROM '
                    . "historialactas as h where h.tActa='C' AND h.estado='A' AND afiliado=".$value->id." limit 1");
                     
            $value->acta = "";
            $value->fechaActa = ""; 
            $value->estadoActa = "";
            if( !empty($h) ){
                $ac = DB::select("SELECT * FROM acta where id='".$h[0]->acta."' limit 1");
                $value->acta = $ac[0]->acta;
                $value->fechaActa = $ac[0]->fecha; 
                $value->estadoActa = $h[0]->estadoActa;
            }
            $value->actaC = "";
            $value->fechaActaC = ""; 
            $value->estadoActaC = "";
            if( !empty($h2) ){
                $ac = DB::select("SELECT * FROM acta where id='".$h2[0]->acta."' limit 1");
                $value->actaC = $ac[0]->acta;
                $value->fechaActaC = $ac[0]->fecha; 
                $value->estadoActaC = $h2[0]->estadoActa;
            }
        }                        
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
    
    public function getBirthdays(){        
        $afiliados = DB::select("SELECT * FROM  afiliadosdb.afiliado 
            WHERE  DATE_ADD(fecha, 
                INTERVAL 
                YEAR( CURDATE() )-YEAR(fecha)
                + IF(DAYOFYEAR(CURDATE()) > DAYOFYEAR(fecha),0,0)
                YEAR)  
            BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) 
            AND estado='A' order by DATE_FORMAT(fecha,'%m/%d')");
        
        $this->getFechaActaAfi($afiliados);
        $l = array( "total" => count( $afiliados ),
                    "tActivos"=>count( $afiliados ),
                    "tInactivos"=>0, 
                    "afiliados" => $afiliados);
        return $l;        
    }
    
    public function getAfiliados(Request $request){
        try {           
            $data = $request->all();
            $act = "0";
            $inact = "0";
            
            if( $data["estado"] == "T" && $data["municipio"] == "T" ){
                $afiliados = Afiliado::orderBy('municipio', 'asc')->get();
                $total = Afiliado::orderBy('municipio', 'asc')->count();
                $act = Afiliado::where('estado','=',"A")->orderBy('municipio', 'asc')->count();
                $inact = Afiliado::where('estado','=',"I")->orderBy('municipio', 'asc')->count();
                
            } elseif ( $data["municipio"] == "T") {
                $afiliados = Afiliado::where('estado','=',$data["estado"])
                        ->orderBy('municipio', 'asc')
                        ->get();
                
                if($data["estado"] == "A"){
                    $act = Afiliado::where('estado','=',"A")->orderBy('municipio', 'asc')->count(); 
                    $total = $act;
                }  
                else {
                    $inact = Afiliado::where('estado','=',"I")->orderBy('municipio', 'asc')->count();
                    $total = $inact;                    
                }
                
            } elseif( $data["estado"] == "T" ){
                $afiliados = Afiliado::where('municipio','=',$data["municipio"])
                        ->orderBy('municipio', 'asc')
                        ->get();
                $total = Afiliado::where('municipio','=',$data["municipio"])
                        ->orderBy('municipio', 'asc')->count();
                $act = Afiliado::where('municipio','=',$data["municipio"])
                            ->where('estado','=',"A")
                            ->orderBy('municipio', 'asc')->count();
                $inact = Afiliado::where('municipio','=',$data["municipio"])
                            ->where('estado','=',"I")
                            ->orderBy('municipio', 'asc')->count();
                                
                
            } else {
                $afiliados = Afiliado::where('estado','=',$data["estado"])
                        ->where('municipio','=',$data["municipio"])
                        ->orderBy('municipio', 'asc')
                        ->get();
                
                if($data["estado"] == "A"){
                    $act = Afiliado::where('municipio','=',$data["municipio"])
                            ->where('estado','=',"A")
                            ->orderBy('municipio', 'asc')->count();
                    $total = $act;                     
                }  else {
                    $inact = Afiliado::where('municipio','=',$data["municipio"])
                            ->where('estado','=',"I")
                            ->orderBy('municipio', 'asc')->count();
                    $total = $inact; 
                    
                } 
            }
            
            $this->getFechaActaAfi($afiliados);
            
            return array("total"=>$total,
                "activos"=>$act,
                "inactivos"=>$inact,
                "afiliados"=>$afiliados);
                                                  
        } catch (Exception $exc) {
            return JsonResponse::create(array('state'=>'KO','message' => "No se pudo guardar el Afiliado", "exception"=>$exc->getMessage(), "request" =>json_encode($data)), 401);
        }
                
    }

}
