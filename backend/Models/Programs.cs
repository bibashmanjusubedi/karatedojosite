using System;
namespace backend.Models
{
    public class Programs
    {
        public int Id{get;set;}
        public string Name{get;set;}
        public string Description{get;set;}
        public string ImageUrl{get;set;}
        public byte[]? Image{get;set;}
        
    }
}