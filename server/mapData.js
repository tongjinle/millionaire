
/*
	type:
		ground
			{	
				name:string,
				price:number,
				group:string,
				buildPrice:number,
				level:number,
				pay:number,
				cost(isAll):number,
				owner:string
			}
		startPoint
			{}
		tax
			{}
		chance
			{}
		jail
			{}
		hotel
			{}
		train
			{
				name:string,
				price:number,
				group:string,
				cost(num:number):number,
				owner:string
			}

*/
var maps =(function(){
	var maps ={};

	maps['default'] = [
		{
			type:'startPoint'
		},
		{
			type:'ground'
			name:'shanghai',
			price:50,
			group:'100'
		},
		{
			type:'tax'
		},
		{
			type:'ground',
			name:'suzhou',
			price:100,
			group:'100'
		},
		{
			type:'ground',
			name:'hangzhou',
			price:80,
			group:'100'
		},
		{
			type:'train',
			name:'xinganxian',
			price:50,
			group:'trainGroup'
		},
		{
			type:'ground',
			name:'guangzhou',
			price:70,
			group:'200'
		},
		{
			type:'chance'
		},
		{
			type:'ground',
			name:'chaozhou',
			price:80,
			group:'200'
		},
		{
			type:'ground',
			name:'dongguan',
			price:150,
			group:'200'
		},
	];

	return maps;
});


module.exports = maps;