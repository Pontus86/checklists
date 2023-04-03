set theScriptsFolder to POSIX path of ((path to me as text) & "::")

tell application "System Events"
    set theScriptNames to name of every file of theScriptsFolder whose name extension is "sh"
end tell

set theScriptName to choose from list theScriptNames with prompt "Select the script you want to run"

if theScriptName is not false then
    set theScriptPath to POSIX path of (theScriptsFolder as text) & theScriptName
    do shell script theScriptPath
end if