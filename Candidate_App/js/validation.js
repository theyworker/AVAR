function validation()
{
	var massage = document.getElementById("msg1");
	var massage2 = document.getElementById("msg2");
	var massage3 = document.getElementById("msg3");

	var fname = document.getElementById("fname").value;
	var email= document.getElementById("email").value;
	var tel=document.getElementById("tel").value;
	var address=document.getElementById("address").value;
	var curemp=document.getElementById("curemp").value;
	var curind=document.getElementById("curind").value;
	var Lurl=document.getElementById("Lurl").value;
	var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	var phoneno = /^\d{10}$/;



	if (fname == "" ||email=="" || tel=="" || address=="" || curemp=="" || curind=="" || Lurl=="") 
	{
		massage.innerHTML = '<div class="alert alert-danger" role="alert">All fields are required</div>';
	}
	else if (!email.match(emailReg))
	{
		massage2.innerHTML = '<div class="alert alert-danger" role="alert">Please enter valid E-mail</div>';
	}
	else if (!tel.match(phoneno))
	{
		massage3.innerHTML = '<div class="alert alert-danger" role="alert">Please enter valid Telephone Number</div>';
	}
	
	else
	{
		window.open("confirmPage.html","_self");
	}

}