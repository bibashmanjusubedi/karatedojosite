using System;
namespace backend.Models
{
    public class Instructor
    {
        public int Id{ get; set; }
        public string Name{get;set; }
        public string Role{get;set;}
        public string Phone {get;set;}
        public string Email {get;set; }
        public string PhotoUrl {get;set;}
        public byte[]? Photo {get;set;}

    }
}