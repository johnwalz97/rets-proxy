YUI.add("yuidoc-meta", function(Y) {
   Y.YUIDoc = { meta: {
    "classes": [],
    "modules": [
        "RETS"
    ],
    "allModules": [
        {
            "displayName": "RETS",
            "name": "RETS",
            "description": "RETS Client\n===========\n\n### Event Types\n- digest.error\n- connection: General connection event - could mean success or error.\n- connection.success: Successful connection only\n- connection.error: General connection error.\n- connection.parse.error: General connection parsing error.\n- connection.closed: Digest authentication connection closed.\n- request.error: General request error.\n- request.parse.error: Request successful, but parsing failed.\n- request.{TYPE}.complete: Request complete.\n- get_meta.complete: Meta loaded\n\n### Response Types\nclasses -"
        }
    ]
} };
});