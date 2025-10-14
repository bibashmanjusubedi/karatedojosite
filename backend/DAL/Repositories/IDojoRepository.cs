using backend.Models;

namespace backend.DAL.Repositories;

public interface IDojoRepository
{
    IEnumerable<Dojo> GetAllDojos();
    Dojo? GetParticularDojo(int id);
    void InsertDojo(Dojo dojo);
    void UpdateDojo(Dojo dojo);
    void DeleteDojo(int id);
}
