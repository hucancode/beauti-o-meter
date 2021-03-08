
var current_candidate = -1;
var candidates = [];
function init()
{
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyBNYoc7NE-2JVer-YcxjxoYGjb4HUParX8",
        authDomain: "beauti-o-meter.firebaseapp.com",
        projectId: "beauti-o-meter",
        storageBucket: "beauti-o-meter.appspot.com",
        messagingSenderId: "449281746767",
        appId: "1:449281746767:web:d12cc57e6f510288f3c73a"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

function fetchCandidates()
{
    var db = firebase.firestore();
    var query = db.collection("candidates").orderBy("started_date", "asc").limit(3);
    query.get().then((snapshot) => {
        var i = 0;
        var avatars = document.getElementById("avatar").getElementsByTagName("img");
        console.log(`avatars length = ${avatars.length}`);
        snapshot.forEach((doc) => {
            candidates.push(doc.id);
            var data = doc.data();
            console.log(`${doc.id} => ${data.avatar}, ${data.started_date}, ${data.rejected_date}`);
            var avatar = avatars[i];
            avatar.src = data.avatar;
            i++;
        });
    });
    if(candidates.length > 0)
    {
        current_candidate = 0;
    }
}

function fetchVotes()
{
    if(current_candidate == -1)
    {
        return;
    }
    var db = firebase.firestore();
    var query = db.collection("votes").where("vote_for", "==", "candidates/"+candidates[current_candidate]);
    var normal_avg = 0;
    var normal_count = 0;
    var power_avg = 0;
    var power_count = 0;
    query.get().then((snapshot) => {
        snapshot.forEach((doc) => {
            var data = doc.data();
            if(data.power_vote)
            {
                power_avg += data.rating;
                power_count += 1;
            }
            else
            {
                normal_avg += data.rating;
                normal_count += 1;
            }
        });
    });
    var power = power_count>0?power_avg/power_count:0;
    var normal = normal_count>0?normal_avg/normal_count:0;
    var count = power_count>0?1:0 + normal_count>0?1:0;
    var score = count>0?(power + normal)/count:0;
    
    var status = document.getElementById("status-text")
    status.classList = [];
    status.classList.add("level-"+Math.floor(score));
    
    var styles = document.styleSheets[0];
    for (var i in styles.cssRules)
    {
        if (styles.cssRules[i].name === 'needle-animation-'+current_candidate)
        {
            var toFrame = styles.cssRules[i].cssRules[1];
            var angle = score*180/5;
            toFrame.style.transform = 'rotate(' + angle + 'deg)';
            break;
        }
    }
    var needle = document.getElementById('needle-img');
    needle.style.animationName = 'needle-animation-'+current_candidate;
}

function switchCandidate(index)
{
    current_candidate = index;
    fetchVotes();
}

function onIPReady(ip)
{
    // enable vote field
}

function vote(score)
{

}

init();
fetchCandidates();