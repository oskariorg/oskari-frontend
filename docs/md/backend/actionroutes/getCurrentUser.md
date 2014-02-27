# GetCurrentUser
Gets current user uuid
User uuid is returned as  quest user uuid, if user is not logged in

## Parameters


## Response
{}

### Success
{}

### Error
stacktrace with HTTP status code 500

## Examples

### Example query for Paikkatietoikkuna
(POST|GET) 
http://www.paikkatietoikkuna.fi/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=2&action_route=GetCurrentUser

Response:
{}
uuid = request.header("currentUserUid")
