# telemetry

## Description

The bundle allows tracking of user interactions with Matomo (Piwik). Currently clicks on main sidebar "Tiles" and toolbar buttons will emit an event into Matomo.

## Configuration

Conf param `endpoint` is required. It can be set in DB or via application property `paikkis.telemetry.endpoint`. The param must be the domain/path where both piwik.php and piwik.js are located, for example "piwik.nls.fi".