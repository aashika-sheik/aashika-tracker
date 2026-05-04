const startDate = new Date(2026, 4, 4);

export function getDateInfo(i){
  const d = new Date(startDate);
  d.setDate(d.getDate()+i);

  const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months=['Jan','Feb','Mar','Apr','May','Jun'];

  return {
    label: days[d.getDay()]+' '+d.getDate()+' '+months[d.getMonth()],
    dow: d.getDay(),
    isWeekend: d.getDay()===0 || d.getDay()===6,
    dateKey: d.toISOString().split("T")[0]
  };
}

export function getDailyQuestions(i){
  const q = [
    ["What did I do well today?","Where did I lack discipline?","What will I improve tomorrow?"],
    ["What gave me energy today?","What drained me?","What is one win today?"],
    ["Where did I waste time?","What did I learn?","What matters most tomorrow?"]
  ];
  return q[i % 3];
}

export function getTasks(i){
  const info = getDateInfo(i);
  const items = [];

  // MORNING
  items.push(
    {time:'4:30 AM',text:'Fajr prayer',tag:'prayer'},
    {time:'4:45 AM',text:'Cold shower',tag:'habit'},
    {time:'5:00 AM',text:'Quran reading — 20 min',tag:'prayer'},
    {time:'5:30 AM',text:'Write 1,000 words',tag:'habit'},
    {time:'7:00 AM',text:'Morning walk — sunlight',tag:'habit'},
    {time:'8:00 AM',text:'Breakfast',tag:'habit'}
  );

  if(!info.isWeekend){
    items.push(
      {time:'9:00 AM',text:'Get ready, settle at desk',tag:'work'},
      {time:'9:30 AM',text:'Coffee',tag:'habit'},
      {time:'9:30 AM',text:'Focus time — deep work',tag:'work'},
      {time:'11:00 AM',text:'Engineering / Ops meeting',tag:'work'},
      {time:'11:30 AM',text:'Admin block',tag:'work'},
      {time:'12:45 PM',text:'Lunch',tag:'habit'},
      {time:'1:45 PM',text:'Dhur prayer',tag:'prayer'},
      {time:'2:00 PM',text:'Focus time',tag:'work'},
      {time:'4:00 PM',text:'Growth sync',tag:'work'},
      {time:'5:10 PM',text:'Break',tag:'habit'},
      {time:'5:30 PM',text:'Asr prayer',tag:'prayer'},
      {time:'6:00 PM',text:'Wrap up',tag:'work'},
      {time:'6:15 PM',text:'Skill study',tag:'habit'},
      {time:'7:00 PM',text:'Dinner',tag:'habit'},
      {time:'7:30 PM',text:'Maghrib prayer',tag:'prayer'},
      {time:'7:45 PM',text:'Walk',tag:'habit'}
    );
  } else {
    items.push(
      {time:'9:30 AM',text:'Coffee',tag:'habit'},
      {time:'10:00 AM',text:'Skill learning',tag:'habit'},
      {time:'1:00 PM',text:'Lunch',tag:'habit'},
      {time:'1:45 PM',text:'Dhur prayer',tag:'prayer'},
      {time:'2:00 PM',text:'Build / write',tag:'habit'},
      {time:'5:30 PM',text:'Asr prayer',tag:'prayer'},
      {time:'6:00 PM',text:'Dinner',tag:'habit'},
      {time:'6:30 PM',text:'Maghrib prayer',tag:'prayer'},
      {time:'6:45 PM',text:'Walk',tag:'habit'}
    );
  }

  // EVENING
  items.push(
    {time:'8:45 PM',text:'Isha prayer',tag:'prayer'},
    {time:'9:00 PM',text:'Wind down',tag:'habit'},
    {time:'9:30 PM',text:'Sleep',tag:'habit'}
  );

  return items;
}