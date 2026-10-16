/* Pure planning helper: source content is never resized or truncated to fit a segment. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ComicSemanticSegments=api})(typeof globalThis!=='undefined'?globalThis:this,()=>{
 function group(units,{preferredCount=3,maxHeight=2300}={}){
  if(!units.length)return[];
  const n=units.length,dp=Array(n+1).fill(Infinity),prev=Array(n+1).fill(-1);dp[0]=0;
  for(let i=1;i<=n;i++)for(let count=1;count<=4&&count<=i;count++){
   const j=i-count;if(!Number.isFinite(dp[j]))continue;
   const height=units.slice(j,i).reduce((s,u)=>s+u.height,0);
   // Never enforce a fixed image ratio. A single uncut large unit is valid.
   if(count>1&&height>maxHeight)continue;
   const c=dp[j]+1+Math.abs(count-preferredCount)*.15+(count===1&&height<600?2:0);
   if(c<dp[i]){dp[i]=c;prev[i]=j}
  }
  const out=[];for(let i=n;i>0;){const j=prev[i];if(j<0)throw Error('No semantic boundary');out.unshift({start:j,end:i,height:units.slice(j,i).reduce((s,u)=>s+u.height,0)});i=j}return out;
 }
 return {group};
});
