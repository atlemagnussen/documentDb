namespace DocumentSys.Extensions;

public class NotFoundException(string message) : Exception(message)
{
}