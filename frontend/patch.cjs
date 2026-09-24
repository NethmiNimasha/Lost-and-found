const fs = require('fs');
const path = require('path');

const reqJavaPath = 'd:\\coursework03\\lost-and-found\\src\\main\\java\\com\\example\\lostandfound\\entity\\Request.java';
let reqJava = fs.readFileSync(reqJavaPath, 'utf8');

if (!reqJava.includes('proofDetails')) {
    reqJava = reqJava.replace(
        'private RequestStatus status;', 
        'private RequestStatus status;\n\n    @Column(columnDefinition = "TEXT")\n    private String proofDetails;'
    );
    reqJava = reqJava.replace(
        'public void setStatus(RequestStatus status) {\n        this.status = status;\n    }',
        'public void setStatus(RequestStatus status) {\n        this.status = status;\n    }\n\n    public String getProofDetails() {\n        return proofDetails;\n    }\n\n    public void setProofDetails(String proofDetails) {\n        this.proofDetails = proofDetails;\n    }'
    );
    fs.writeFileSync(reqJavaPath, reqJava);
    console.log('Patched Request.java');
}

const reqServicePath = 'd:\\coursework03\\lost-and-found\\src\\main\\java\\com\\example\\lostandfound\\service\\RequestService.java';
let reqService = fs.readFileSync(reqServicePath, 'utf8');

if (reqService.includes('Long itemId')) {
    reqService = reqService.replace(
        'public Request createRequest(Long itemId, String username) {',
        'public Request createRequest(Request requestData, String username) {'
    );
    reqService = reqService.replace(
        'logger.debug("Creating request for item \'{}\' by user \'{}\'", itemId, username);',
        'logger.debug("Creating request for item \'{}\' by user \'{}\'", requestData.getItem().getId(), username);'
    );
    reqService = reqService.replace(
        'Item item = itemRepository.findById(itemId)',
        'Item item = itemRepository.findById(requestData.getItem().getId())'
    );
    reqService = reqService.replace(
        'orElseThrow(() -> new RuntimeException("Item not found: " + itemId));',
        'orElseThrow(() -> new RuntimeException("Item not found: " + requestData.getItem().getId()));'
    );
    reqService = reqService.replace(
        'Request request = new Request(user, item, RequestStatus.PENDING);',
        'Request request = new Request(user, item, RequestStatus.PENDING);\n        request.setProofDetails(requestData.getProofDetails());'
    );
    fs.writeFileSync(reqServicePath, reqService);
    console.log('Patched RequestService.java');
}

const reqControllerPath = 'd:\\coursework03\\lost-and-found\\src\\main\\java\\com\\example\\lostandfound\\controller\\RequestController.java';
let reqController = fs.readFileSync(reqControllerPath, 'utf8');

if (reqController.includes('@PostMapping("/item/{itemId}")')) {
    reqController = reqController.replace(
        '@PostMapping("/item/{itemId}")\n    public ResponseEntity<?> createRequest(@PathVariable Long itemId, Authentication authentication) {\n        logger.info("POST /api/requests/item/{} \\uFFFD?\\" submitted by \'{}\'", itemId, authentication.getName());\n        Request request = requestService.createRequest(itemId, authentication.getName());\n        return ResponseEntity.ok(request);\n    }',
        '@PostMapping\n    public ResponseEntity<?> createRequest(@RequestBody Request requestData, Authentication authentication) {\n        logger.info("POST /api/requests \\uFFFD?\\" submitted by \'{}\'", authentication.getName());\n        Request request = requestService.createRequest(requestData, authentication.getName());\n        return ResponseEntity.ok(request);\n    }'
    );
    // Note: The logger line had some weird replacement character `?`, let's just replace everything inside the method.
}
// Try a more robust replacement for the controller method
const methodRegex = /@PostMapping\("\/item\/\{itemId\}"\)[\s\S]*?return ResponseEntity\.ok\(request\);\s*\}/;
reqController = reqController.replace(methodRegex, 
`@PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Request requestData, Authentication authentication) {
        logger.info("POST /api/requests submitted by '{}'", authentication.getName());
        Request request = requestService.createRequest(requestData, authentication.getName());
        return ResponseEntity.ok(request);
    }`
);

const putMethodRegex = /@PutMapping\("(?:\/\{id\}\/status)?"\)[\s\S]*?return ResponseEntity\.ok\(requestService\.updateRequestStatus\(id, status\)\);\s*\}/;
if (putMethodRegex.test(reqController)) {
    reqController = reqController.replace(putMethodRegex,
`@PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Request> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        RequestStatus status = RequestStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(requestService.updateRequestStatus(id, status));
    }`
    );
}

fs.writeFileSync(reqControllerPath, reqController);
console.log('Patched RequestController.java');
