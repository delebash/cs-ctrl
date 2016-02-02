export class Grid
{
    constructor()
    {
        this.rows = 
        [
            {id:  1, firstname: 'Howie',  lastname: 'Diddot', age: 35, salary: 30000.01},
            {id:  2, firstname: 'Anita',  lastname: 'Bath',   age: 33, salary: 70000.00},
            {id:  3, firstname: 'Bill',   lastname: 'Ding',   age: 20, salary: 3000.00},
            {id:  4, firstname: 'Hugh',   lastname: 'Jass',   age: 11, salary: 20000.99},
            {id:  5, firstname: 'Hugh',   lastname: 'DeMann', age: 26, salary: 30000.01},
            {id:  6, firstname: 'Nick',   lastname: 'Carrs',  age: 15, salary: 70000.00},
            {id:  7, firstname: 'Robin',  lastname: 'Banks',  age: 64, salary: 3000.00},
            {id:  8, firstname: 'Anna',   lastname: 'Sasin',  age: 55, salary: 20000.99},
            {id:  9, firstname: 'Mo',     lastname: 'Lestor', age: 36, salary: 30000.01},
            {id: 10, firstname: 'Carrie', lastname: 'Oakey',  age: 77, salary: 70000.00},
        ];

        this.rows2 = 
        [
            {id:  1, name: 'Mortal Kombat X',            platform: 'Xbox 360', dt: '2015-06-23'},
            {id:  2, name: 'Mortal Kombat X',            platform: 'PS3',      dt: '2015-06-23'},
            {id:  3, name: 'Tales from the Borderlands', platform: 'Xbox 360', dt: '2015-06-24'},
            {id:  4, name: 'F1 2015',                    platform: 'Xbox One', dt: '2015-06-30'},
            {id:  5, name: 'F1 2015',                    platform: 'PS4',      dt: '2015-06-30'},
            {id:  6, name: 'Devil May Cry 4 SE',         platform: 'PS4',      dt: '2015-07-07'},
            {id:  7, name: 'God of War 3 Remastered',    platform: 'PS4',      dt: '2015-07-14'},
            {id:  8, name: 'Rory Mcllroy PGA Tour',      platform: 'PS3',      dt: '2015-07-14'},
            {id:  9, name: 'Rory Mcllroy PGA Tour',      platform: 'Xbox 360', dt: '2015-07-14'},
            {id: 10, name: 'Tekken 7',                   platform: 'PS4',      dt: '2015-07-21'},
        ];
    }
    
    onClick(item)
    {
        alert("Clicked: " + item.firstname);
    }

    setIDsTo99()
    {
        for (var i = 0; i < this.rows.length; i++) 
        {
            this.rows[i].id = 99;
        }
    }

    getData(f)
    {
        //Simulate a server query that does sorting...
        if(f.sort)
        {
            var sortField = f.sort.split(" ")[0];
            var isDesc    = f.sort.split(" ").length > 1;
            var dir       = isDesc ? -1 : 1;
    
            this.rows2.sort(function(a,b)
            {
                return (((a[sortField] < b[sortField]) ? -1 : ((a[sortField] > b[sortField]) ? 1 : 0))) * dir;
            });
        }        

        //...and paging
        var start = (f.pgNum-1) * f.pgSize;
        var data = this.rows2.slice(start, start+Number(f.pgSize));
        
        var total = this.rows2.length;
        return new Promise(function(resolve, reject)
        {
            setTimeout(function()
            {
                resolve({items:data, total:total});
            }, 500);
        });
    }
}