<?php 
namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use App\Models\TblMpEstructuraOrganizacional;
use Illuminate\Http\Request;
use Exception;
class TblMpEstructuraOrganizacionalController extends Controller
{
	/**
     * List table records
	 * @param  \Illuminate\Http\Request
     * @param string $fieldname //filter records by a table field
     * @param string $fieldvalue //filter value
     * @return \Illuminate\View\View
     */
	function index(Request $request, $fieldname = null , $fieldvalue = null){
		$query = TblMpEstructuraOrganizacional::query();
		if($request->search){
			$search = trim($request->search);
			TblMpEstructuraOrganizacional::search($query, $search);
		}
		$orderby = $request->orderby ?? "tbl_mp_estructura_organizacional.eo_id";
		$ordertype = $request->ordertype ?? "desc";
		$query->orderBy($orderby, $ordertype);
		if($fieldname){
			$query->where($fieldname , $fieldvalue);
		}
		$records = $this->paginate($query, TblMpEstructuraOrganizacional::listFields());
		return $this->respond($records);
	}
	
	/**
     * Select table record by ID
	 * @param string $rec_id
     * @return \Illuminate\View\View
     */
	function view($rec_id = null){
		$query = TblMpEstructuraOrganizacional::query();
		$record = $query->findOrFail($rec_id, TblMpEstructuraOrganizacional::viewFields());
		return $this->respond($record);
	}
	
	/**
     * Save form record to the table
     * @return \Illuminate\Http\Response
     */
	function add(Request $request){
		$modeldata = $this->normalizeFormData($request->all());
		
		$record = TblMpEstructuraOrganizacional::create($modeldata);
		$rec_id = $record->eo_id;
		return $this->respond($record);
	}
	
	/**
     * Update table record with form data
	 * @param string $rec_id //select record by table primary key
     * @return \Illuminate\View\View;
     */
	function edit(Request $request, $rec_id = null){
		$query = TblMpEstructuraOrganizacional::query();
		$record = $query->findOrFail($rec_id, TblMpEstructuraOrganizacional::editFields());
		if ($request->isMethod('post')) {
			$modeldata = $this->normalizeFormData($request->all());
			$record->update($modeldata);
		}
		return $this->respond($record);
	}
	
	/**
     * Delete record from the database
	 * Support multi delete by separating record id by comma.
	 * @param  \Illuminate\Http\Request
	 * @param string $rec_id //can be separated by comma 
     * @return \Illuminate\Http\Response
     */
	function delete(Request $request, $rec_id = null){
		$arr_id = explode(",", $rec_id);
		$query = TblMpEstructuraOrganizacional::query();
		$query->whereIn("eo_id", $arr_id);
		$query->delete();
		return $this->respond($arr_id);
	}
	
	/**
     * Get tree structure of organizational structure
     * @return \Illuminate\Http\Response
     */
	function getTree(){
		try {
			$query = TblMpEstructuraOrganizacional::query();
			$query->where('eo_pr_id', 21);
			$allNodes = $query->get(['eo_id', 'eo_descripcion', 'eo_cp_id', 'eo_pr_id', 'eo_cod_superior']);
			
			\Log::info("Total nodes found with eo_pr_id = 21: " . count($allNodes));
			
			$cpidCounts = [];
			$supCounts = [];
			foreach ($allNodes as $node) {
				$cpidCounts[$node->eo_cp_id] = ($cpidCounts[$node->eo_cp_id] ?? 0) + 1;
				$supCounts[$node->eo_cod_superior] = ($supCounts[$node->eo_cod_superior] ?? 0) + 1;
			}
			
			\Log::info("Distribution by eo_cp_id:", $cpidCounts);
			\Log::info("Distribution by eo_cod_superior:", $supCounts);
			
			$nodeMap = [];
			foreach ($allNodes as $node) {
				$nodeMap[$node->eo_id] = [
					'key' => $node->eo_id,
					'label' => $node->eo_descripcion,
					'data' => $node->eo_id,
					'eo_cp_id' => $node->eo_cp_id,
					'eo_cod_superior' => $node->eo_cod_superior,
					'eo_pr_id' => $node->eo_pr_id,
					'children' => []
				];
			}
			
			$rootNodes = [];
			foreach ($nodeMap as $id => $node) {
				if ($node['eo_cp_id'] == 0) {
					$rootNodes[$id] = $id;
				}
			}
			\Log::info("Root nodes (eo_cp_id = 0) found: " . count($rootNodes));
			
			foreach ($nodeMap as $id => $node) {
				if ($node['eo_cp_id'] == 0) {
					continue;
				}
				
				if (isset($nodeMap[$node['eo_cod_superior']])) {
					$nodeMap[$node['eo_cod_superior']]['children'][] = &$nodeMap[$id];
				} else {
					\Log::warning("Node {$id} has invalid eo_cod_superior: {$node['eo_cod_superior']}");
				}
			}
			
			$tree = [];
			foreach ($nodeMap as $id => $node) {
				if ($node['eo_cp_id'] == 0) {
					$tree[] = $node;
				}
			}
			
			$nodesWithChildren = 0;
			foreach ($nodeMap as $id => $node) {
				if (count($node['children']) > 0) {
					$nodesWithChildren++;
					\Log::debug("Node {$id} has " . count($node['children']) . " children");
				}
			}
			
			$stats = [
				'total_nodes' => count($allNodes),
				'root_nodes' => count($rootNodes),
				'child_nodes' => count($allNodes) - count($rootNodes),
				'nodes_with_children' => $nodesWithChildren,
				'filter_pr_id' => 21
			];
			
			return $this->respond([
				'tree' => $tree,
				'stats' => $stats
			]);
		} catch (Exception $e) {
			\Log::error("Error building tree: " . $e->getMessage());
			\Log::error($e->getTraceAsString());
			return $this->respondWithError($e);
		}
	}
}
